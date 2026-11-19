import { Injectable, OnDestroy } from '@angular/core';
import { getSupabase, isSupabaseConfigured } from '../core/supabase';

type EventType =
  | 'section_view'
  | 'project_view'
  | 'contact_submit'
  | 'resume_click'
  | 'outbound_click'
  | 'language_toggle'
  | 'theme_toggle'
  | 'terminal_command';

interface GeoInfo {
  country_code: string | null;
  country_name: string | null;
  city: string | null;
}

const GEOLOCATION_CACHE_KEY = 'portfolio:geo';
const VISITOR_KEY = 'portfolio:visitor-id';
const SESSION_KEY = 'portfolio:session-id';

const BLOCKED_PATH_PREFIXES = ['/admin'];

/**
 * Servicio de analítica propio (sin cookies de terceros).
 *
 * Guarda visitas y eventos en Supabase. Si no hay credenciales configuradas
 * simplemente no hace nada, así que el portafolio sigue funcionando igual.
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService implements OnDestroy {
  private enabled = false;
  private initialized = false;
  private visitId: string | null = null;
  private visitorId = '';
  private sessionId = '';
  private activeStartedAt = 0;
  private activeSeconds = 0;
  private maxScroll = 0;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private sectionObserver: IntersectionObserver | null = null;
  private seenSections = new Set<string>();
  private trackListenersAttached = false;

  private readonly onScroll = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollable <= 0) return;
    const percent = Math.round((window.scrollY / scrollable) * 100);
    if (percent > this.maxScroll) this.maxScroll = Math.min(percent, 100);
  };

  private readonly onVisibility = () => {
    if (document.visibilityState === 'hidden') {
      this.pauseTimer();
      this.flushDuration();
    } else {
      this.activeStartedAt = Date.now();
    }
  };

  private readonly onPageHide = () => {
    this.pauseTimer();
    this.flushDuration();
  };

  private readonly onDocumentClick = (event: MouseEvent) => {
    const target = (event.target as HTMLElement | null)?.closest('a');
    if (!target) return;

    const href = target.getAttribute('href') ?? '';
    const label = (target.textContent ?? '').trim().slice(0, 80);

    if (href.startsWith('mailto:')) {
      this.track('outbound_click', 'email', { label });
      return;
    }

    if (href.startsWith('tel:')) {
      this.track('outbound_click', 'phone', { label });
      return;
    }

    if (!/^https?:\/\//i.test(href)) return;

    try {
      const url = new URL(href, window.location.href);
      if (url.host !== window.location.host) {
        this.track('outbound_click', url.host, { label, url: url.href.slice(0, 300) });
      }
    } catch {
      /* ignore malformed URLs */
    }
  };

  init(): void {
    if (this.initialized || typeof window === 'undefined') return;
    this.initialized = true;

    if (!isSupabaseConfigured()) return;
    if (BLOCKED_PATH_PREFIXES.some((prefix) => window.location.pathname.startsWith(prefix))) return;
    // Abre el portafolio con ?ignore-analytics=1 una vez para excluir tu propio navegador.
    const params = new URLSearchParams(window.location.search);
    if (params.has('ignore-analytics')) {
      localStorage.setItem('portfolio:ignore', '1');
      console.info('[analytics] este navegador ya no será contabilizado.');
      return;
    }
    if (localStorage.getItem('portfolio:ignore') === '1') return;

    this.enabled = true;
    this.activeStartedAt = Date.now();
    this.visitorId = this.getOrCreateId(VISITOR_KEY, localStorage);
    this.sessionId = this.getOrCreateId(SESSION_KEY, sessionStorage);

    this.trackPageView();
    this.attachGlobalTracking();
    this.observeSections();

    this.heartbeatTimer = setInterval(() => this.flushDuration(), 30000);
  }

  trackPageView(): void {
    if (!this.enabled) return;

    const visitId = this.uuid();
    this.visitId = visitId;
    this.activeStartedAt = Date.now();
    this.activeSeconds = 0;
    this.maxScroll = 0;

    this.getGeo().then((geo) => {
      const supabase = getSupabase();
      if (!supabase) return;

      const device = this.getDeviceInfo();
      const params = new URLSearchParams(window.location.search);
      const referrer = document.referrer || null;
      const ownHost = window.location.host;

      let referrerHost: string | null = null;
      if (referrer) {
        try {
          const host = new URL(referrer).host;
          if (host && host !== ownHost) referrerHost = host;
        } catch {
          /* ignore */
        }
      }

      void supabase
        .from('portfolio_visits')
        .insert({
          id: visitId,
          visitor_id: this.visitorId,
          session_id: this.sessionId,
          path: window.location.pathname + window.location.hash,
          referrer: referrer ? referrer.slice(0, 500) : null,
          referrer_host: referrerHost,
          utm_source: params.get('utm_source'),
          utm_medium: params.get('utm_medium'),
          utm_campaign: params.get('utm_campaign'),
          country_code: geo.country_code,
          country_name: geo.country_name,
          city: geo.city,
          device_type: device.deviceType,
          browser: device.browser,
          os: device.os,
          screen_width: window.screen?.width ?? null,
          screen_height: window.screen?.height ?? null,
          language: navigator.language || null,
          timezone: this.getTimezone(),
          duration_seconds: 0,
          scroll_depth: 0,
          last_seen_at: new Date().toISOString(),
        })
        .then(({ error }) => {
          if (error) console.warn('[analytics] no se pudo registrar la visita:', error.message);
        });
    });
  }

  track(eventType: EventType, eventName?: string, metadata: Record<string, unknown> = {}): void {
    if (!this.enabled) return;

    const supabase = getSupabase();
    if (!supabase) return;

    void supabase
      .from('portfolio_events')
      .insert({
        visitor_id: this.visitorId,
        session_id: this.sessionId,
        visit_id: this.visitId,
        event_type: eventType,
        event_name: eventName ?? null,
        metadata,
      })
      .then(({ error }) => {
        if (error) console.warn('[analytics] no se pudo registrar el evento:', error.message);
      });
  }

  /** Envía el tiempo y la profundidad de scroll actuales de la visita. */
  flushDuration(): void {
    if (!this.enabled || !this.visitId) return;

    const supabase = getSupabase();
    if (!supabase) return;

    const seconds = Math.min(this.currentActiveSeconds(), 7200);
    void supabase
      .rpc('portfolio_touch_visit', {
        p_visit_id: this.visitId,
        p_seconds: seconds,
        p_scroll: this.maxScroll,
      })
      .then(({ error }) => {
        if (error) console.warn('[analytics] no se pudo actualizar la duración:', error.message);
      });
  }

  private currentActiveSeconds(): number {
    const running =
      document.visibilityState === 'visible' && this.activeStartedAt > 0
        ? Math.max(0, (Date.now() - this.activeStartedAt) / 1000)
        : 0;
    return Math.round(this.activeSeconds + running);
  }

  private pauseTimer(): void {
    if (this.activeStartedAt > 0) {
      this.activeSeconds += Math.max(0, (Date.now() - this.activeStartedAt) / 1000);
    }
    this.activeStartedAt = 0;
  }

  private attachGlobalTracking(): void {
    if (this.trackListenersAttached) return;
    this.trackListenersAttached = true;

    window.addEventListener('scroll', this.onScroll, { passive: true });
    document.addEventListener('visibilitychange', this.onVisibility);
    window.addEventListener('pagehide', this.onPageHide);
    document.addEventListener('click', this.onDocumentClick, true);
  }

  private observeSections(): void {
    if (typeof IntersectionObserver === 'undefined') return;

    const sections = Array.from(document.querySelectorAll<HTMLElement>('section[id]'));
    if (!sections.length) return;

    this.sectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.35) continue;

          const id = (entry.target as HTMLElement).id;
          if (!id || this.seenSections.has(id)) continue;

          this.seenSections.add(id);
          this.track('section_view', id);
        }
      },
      { threshold: [0.35, 0.6] },
    );

    sections.forEach((section) => this.sectionObserver?.observe(section));
  }

  private getOrCreateId(key: string, storage: Storage): string {
    const existing = storage.getItem(key);
    if (existing) return existing;

    const id = this.uuid();
    storage.setItem(key, id);
    return id;
  }

  private uuid(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
      const random = (Math.random() * 16) | 0;
      const value = char === 'x' ? random : (random & 0x3) | 0x8;
      return value.toString(16);
    });
  }

  private async getGeo(): Promise<GeoInfo> {
    const cached = sessionStorage.getItem(GEOLOCATION_CACHE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached) as GeoInfo;
      } catch {
        /* ignore */
      }
    }

    const empty: GeoInfo = { country_code: null, country_name: null, city: null };

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3500);

      const response = await fetch('https://ipapi.co/json/', { signal: controller.signal });
      clearTimeout(timeout);

      if (!response.ok) return empty;

      const data = (await response.json()) as {
        country_code?: string;
        country_name?: string;
        city?: string;
      };

      const geo: GeoInfo = {
        country_code: data.country_code ?? null,
        country_name: data.country_name ?? null,
        city: data.city ?? null,
      };

      sessionStorage.setItem(GEOLOCATION_CACHE_KEY, JSON.stringify(geo));
      return geo;
    } catch {
      return empty;
    }
  }

  private getDeviceInfo(): { deviceType: string; browser: string; os: string } {
    const ua = navigator.userAgent;
    const isTablet =
      /iPad|Tablet|PlayBook|Silk/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua));
    const isMobile = /Mobi|iPhone|iPod|Android.*Mobile|Windows Phone/i.test(ua);

    const deviceType = isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop';

    let browser = 'Otro';
    if (/Edg\//i.test(ua)) browser = 'Edge';
    else if (/OPR\/|Opera/i.test(ua)) browser = 'Opera';
    else if (/Chrome\//i.test(ua) && !/Chromium/i.test(ua)) browser = 'Chrome';
    else if (/Firefox\//i.test(ua)) browser = 'Firefox';
    else if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';

    let os = 'Otro';
    if (/Windows NT/i.test(ua)) os = 'Windows';
    else if (/Android/i.test(ua)) os = 'Android';
    else if (/iOS|iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
    else if (/Mac OS X/i.test(ua)) os = 'macOS';
    else if (/Linux/i.test(ua)) os = 'Linux';

    return { deviceType, browser, os };
  }

  private getTimezone(): string | null {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone ?? null;
    } catch {
      return null;
    }
  }

  ngOnDestroy(): void {
    this.pauseTimer();
    this.flushDuration();

    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    this.sectionObserver?.disconnect();

    window.removeEventListener('scroll', this.onScroll);
    document.removeEventListener('visibilitychange', this.onVisibility);
    window.removeEventListener('pagehide', this.onPageHide);
    document.removeEventListener('click', this.onDocumentClick, true);
  }
}
