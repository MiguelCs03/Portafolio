import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { isApiConfigured } from '../../core/api';
import { AdminService, DashboardData, EventRow, VisitRow } from './admin.service';

const DAY_MS = 86_400_000;

interface CountItem {
  label: string;
  count: number;
  pct: number;
}

interface ChartPoint {
  x: number;
  y: number;
  visits: number;
  unique: number;
  label: string;
}

function localDayKey(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function countBy<T>(
  items: T[],
  keyFn: (item: T) => string | null | undefined,
): Map<string, number> {
  const map = new Map<string, number>();
  for (const item of items) {
    const key = keyFn(item);
    if (!key) continue;
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return map;
}

function toRanking(map: Map<string, number>, total: number, limit = 6): CountItem[] {
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, count]) => ({
      label,
      count,
      pct: total > 0 ? Math.round((count / total) * 100) : 0,
    }));
}

@Component({
  selector: 'app-admin',
  imports: [FormsModule, DatePipe],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit, OnDestroy {
  readonly configured = isApiConfigured();

  readonly session = signal<{ email: string | null } | null>(null);
  readonly loading = signal(false);
  readonly authBusy = signal(false);
  readonly error = signal('');
  readonly loginError = signal('');
  readonly days = signal(7);
  readonly data = signal<DashboardData>({ visits: [], events: [] });
  readonly updatedAt = signal<Date | null>(null);
  readonly selfIgnored = signal(
    typeof localStorage !== 'undefined' && localStorage.getItem('portfolio:ignore') === '1',
  );
  readonly actionBusy = signal(false);
  readonly actionNotice = signal('');

  email = '';
  password = '';
  showPassword = false;

  private refreshTimer: ReturnType<typeof setInterval> | null = null;

  constructor(private readonly admin: AdminService) {}

  ngOnInit(): void {
    document.documentElement.classList.add('dark');

    if (!this.configured) return;

    void this.admin.getSession().then((session) => {
      if (session?.user) {
        this.markSelfIgnored();
        this.session.set({ email: session.user.email ?? null });
        void this.load();
        this.startAutoRefresh();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.refreshTimer) clearInterval(this.refreshTimer);
  }

  // ---------------------------------------------------------------- auth

  async login(): Promise<void> {
    if (!this.password) {
      this.loginError.set('Ingresa tu contraseña.');
      return;
    }

    this.authBusy.set(true);
    this.loginError.set('');

    try {
      await this.admin.signIn(this.email.trim(), this.password);
      const session = await this.admin.getSession();

      if (!session?.user) throw new Error('No se pudo iniciar sesión.');

      this.markSelfIgnored();
      this.session.set({ email: session.user.email ?? null });
      this.email = '';
      this.password = '';
      await this.load();
      this.startAutoRefresh();
    } catch (error) {
      this.loginError.set(this.describeError(error));
    } finally {
      this.authBusy.set(false);
    }
  }

  async logout(): Promise<void> {
    await this.admin.signOut();
    if (this.refreshTimer) clearInterval(this.refreshTimer);
    this.session.set(null);
    this.data.set({ visits: [], events: [] });
    this.updatedAt.set(null);
  }

  // ---------------------------------------------------------------- data

  async load(): Promise<void> {
    if (!this.session()) return;

    this.loading.set(true);
    this.error.set('');

    try {
      const days = this.days();
      // Cargamos el doble del rango para poder comparar con el periodo anterior.
      const result = await this.admin.load(days * 2);
      this.data.set(result);
      this.updatedAt.set(new Date());
    } catch (error) {
      this.error.set(this.describeError(error));
    } finally {
      this.loading.set(false);
    }
  }

  setRange(days: number): void {
    if (this.days() === days) return;
    this.days.set(days);
    void this.load();
  }

  refresh(): void {
    void this.load();
  }

  toggleSelfIgnore(): void {
    if (typeof localStorage === 'undefined') return;
    if (this.selfIgnored()) {
      localStorage.removeItem('portfolio:ignore');
      this.selfIgnored.set(false);
    } else {
      localStorage.setItem('portfolio:ignore', '1');
      this.selfIgnored.set(true);
    }
  }

  async cleanupBots(): Promise<void> {
    this.actionBusy.set(true);
    this.actionNotice.set('');
    try {
      const res = await this.admin.cleanupBots();
      this.actionNotice.set(
        `Limpieza lista: ${res.deletedVisits} visitas bot eliminadas.`,
      );
      await this.load();
    } catch (error) {
      this.error.set(this.describeError(error));
    } finally {
      this.actionBusy.set(false);
    }
  }

  async resetAnalytics(): Promise<void> {
    if (
      typeof window !== 'undefined' &&
      !window.confirm('¿Seguro que deseas borrar todas las visitas y eventos de prueba para empezar desde 0?')
    ) {
      return;
    }
    this.actionBusy.set(true);
    this.actionNotice.set('');
    try {
      const res = await this.admin.resetAll();
      this.actionNotice.set(
        `Panel reiniciado (${res.deletedVisits} visitas y ${res.deletedEvents} eventos borrados).`,
      );
      await this.load();
    } catch (error) {
      this.error.set(this.describeError(error));
    } finally {
      this.actionBusy.set(false);
    }
  }

  private markSelfIgnored(): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem('portfolio:ignore', '1');
    this.selfIgnored.set(true);
  }

  private startAutoRefresh(): void {
    if (this.refreshTimer) clearInterval(this.refreshTimer);
    this.refreshTimer = setInterval(() => {
      if (document.visibilityState === 'visible') void this.load();
    }, 60_000);
  }

  private describeError(error: unknown): string {
    if (!error) return 'Error desconocido.';
    if (typeof error === 'string') return error;
    if (error instanceof Error) return error.message;
    if (typeof error === 'object' && 'message' in error)
      return String((error as { message: unknown }).message);
    return 'No se pudieron cargar los datos.';
  }

  // ------------------------------------------------------------- computed

  private readonly periodStart = computed(() => {
    const reference = this.updatedAt()?.getTime() ?? Date.now();
    return reference - this.days() * DAY_MS;
  });

  readonly currentVisits = computed(() =>
    this.data().visits.filter(
      (visit) => new Date(visit.created_at).getTime() >= this.periodStart(),
    ),
  );

  readonly previousVisits = computed(() =>
    this.data().visits.filter((visit) => new Date(visit.created_at).getTime() < this.periodStart()),
  );

  readonly currentEvents = computed(() =>
    this.data().events.filter(
      (event) => new Date(event.created_at).getTime() >= this.periodStart(),
    ),
  );

  readonly totalVisits = computed(() => this.currentVisits().length);
  readonly uniqueVisitors = computed(
    () => new Set(this.currentVisits().map((v) => v.visitor_id)).size,
  );
  readonly totalSessions = computed(
    () => new Set(this.currentVisits().map((v) => v.session_id)).size,
  );

  readonly todayVisits = computed(() => {
    const today = localDayKey(new Date());
    return this.currentVisits().filter((v) => localDayKey(new Date(v.created_at)) === today).length;
  });

  readonly liveNow = computed(() => {
    const threshold = Date.now() - 5 * 60_000;
    const sessions = new Set(
      this.currentVisits()
        .filter((v) => new Date(v.last_seen_at ?? v.created_at).getTime() >= threshold)
        .map((v) => v.session_id),
    );
    return sessions.size;
  });

  readonly growth = computed(() => {
    const current = this.currentVisits().length;
    const previous = this.previousVisits().length;
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  });

  readonly avgDuration = computed(() => {
    const bySession = new Map<string, number>();
    for (const visit of this.currentVisits()) {
      const current = bySession.get(visit.session_id) ?? 0;
      bySession.set(visit.session_id, Math.max(current, visit.duration_seconds ?? 0));
    }
    if (!bySession.size) return 0;
    return Math.round([...bySession.values()].reduce((a, b) => a + b, 0) / bySession.size);
  });

  readonly avgScroll = computed(() => {
    if (!this.currentVisits().length) return 0;
    const withData = this.currentVisits().filter((v) => (v.scroll_depth ?? 0) > 0);
    if (!withData.length) return 0;
    return Math.round(
      withData.reduce((sum, v) => sum + (v.scroll_depth ?? 0), 0) / withData.length,
    );
  });

  readonly daily = computed(() => {
    const days = this.days();
    const reference = this.updatedAt() ?? new Date();
    const buckets: { key: string; label: string; date: Date; visits: number; unique: number }[] =
      [];

    for (let offset = days - 1; offset >= 0; offset--) {
      const date = new Date(
        reference.getFullYear(),
        reference.getMonth(),
        reference.getDate() - offset,
      );
      buckets.push({
        key: localDayKey(date),
        label: `${date.getDate()}/${date.getMonth() + 1}`,
        date,
        visits: 0,
        unique: 0,
      });
    }

    const index = new Map(buckets.map((bucket) => [bucket.key, bucket]));
    const visitors = new Map<string, Set<string>>();

    for (const visit of this.currentVisits()) {
      const key = localDayKey(new Date(visit.created_at));
      const bucket = index.get(key);
      if (!bucket) continue;
      bucket.visits++;
      if (!visitors.has(key)) visitors.set(key, new Set());
      visitors.get(key)!.add(visit.visitor_id);
    }

    for (const bucket of buckets) {
      bucket.unique = visitors.get(bucket.key)?.size ?? 0;
    }

    return buckets;
  });

  readonly chart = computed(() => {
    const series = this.daily();
    const width = 720;
    const height = 200;
    const paddingX = 18;
    const paddingY = 24;
    const max = Math.max(1, ...series.map((point) => point.visits));
    const stepX = series.length > 1 ? (width - paddingX * 2) / (series.length - 1) : 0;

    const points: ChartPoint[] = series.map((point, i) => ({
      ...point,
      x: paddingX + i * stepX,
      y: height - paddingY - (point.visits / max) * (height - paddingY * 2),
    }));

    const line = points
      .map((point, i) => `${i === 0 ? 'M' : 'L'}${point.x.toFixed(1)},${point.y.toFixed(1)}`)
      .join(' ');
    const area = points.length
      ? `${line} L${points[points.length - 1].x.toFixed(1)},${height} L${points[0].x.toFixed(1)},${height} Z`
      : '';

    return {
      points,
      line,
      area,
      max,
      width,
      height,
      paddingX,
      paddingY,
      labelEvery: Math.max(1, Math.ceil(series.length / 8)),
    };
  });

  private readonly referrerMap = computed(() => {
    const map = new Map<string, number>();
    for (const visit of this.currentVisits()) {
      let label = visit.referrer_host ?? 'Directo';
      label = label.replace(/^www\./i, '').toLowerCase();
      const friendly: Record<string, string> = {
        'google.com': 'Google',
        'linkedin.com': 'LinkedIn',
        'github.com': 'GitHub',
        'instagram.com': 'Instagram',
        'facebook.com': 'Facebook',
        'youtube.com': 'YouTube',
        't.co': 'X / Twitter',
        'x.com': 'X / Twitter',
        'bing.com': 'Bing',
      };
      map.set(friendly[label] ?? label, (map.get(friendly[label] ?? label) ?? 0) + 1);
    }
    return map;
  });

  readonly referrers = computed(() =>
    toRanking(this.referrerMap(), this.currentVisits().length, 6),
  );

  readonly countries = computed(() => {
    const map = countBy(
      this.currentVisits(),
      (visit) => visit.country_code ?? visit.country_name ?? 'Desconocido',
    );
    return toRanking(map, this.currentVisits().length, 8).map((item) => ({
      ...item,
      flag: item.label.length === 2 ? this.flag(item.label) : '🌐',
      label: item.label.length === 2 ? this.countryName(item.label) : item.label,
    }));
  });

  readonly devices = computed(() => {
    const labels: Record<string, string> = {
      desktop: 'Escritorio',
      mobile: 'Móvil',
      tablet: 'Tablet',
    };
    const map = countBy(this.currentVisits(), (visit) => labels[visit.device_type ?? ''] ?? 'Otro');
    const ranking = toRanking(map, this.currentVisits().length, 4);
    const colors = ['#00dfc1', '#00d2ff', '#a855f7', '#f59e0b'];
    return ranking.map((item, i) => ({ ...item, color: colors[i] ?? '#64748b' }));
  });

  readonly deviceBar = computed(() => {
    const devices = this.devices();
    if (!devices.length) return 'conic-gradient(#1f2937 0% 100%)';
    let cursor = 0;
    const parts = devices.map((device) => {
      const start = cursor;
      cursor += device.pct;
      return `${device.color} ${start}% ${cursor}%`;
    });
    return `conic-gradient(${parts.join(', ')})`;
  });

  readonly browsers = computed(() =>
    toRanking(
      countBy(this.currentVisits(), (visit) => visit.browser ?? 'Otro'),
      this.currentVisits().length,
      6,
    ),
  );

  readonly languages = computed(() =>
    toRanking(
      countBy(
        this.currentVisits(),
        (visit) => (visit.language ?? '').split('-')[0].toUpperCase() || 'Otro',
      ),
      this.currentVisits().length,
      4,
    ),
  );

  readonly projects = computed(() =>
    toRanking(
      countBy(
        this.currentEvents().filter((event) => event.event_type === 'project_view'),
        (event) => event.event_name,
      ),
      this.currentEvents().filter((event) => event.event_type === 'project_view').length,
      6,
    ),
  );

  readonly sections = computed(() => {
    const labels: Record<string, string> = {
      hero: 'Inicio / Hero',
      tech: 'Tech Stack',
      experience: 'Experiencia',
      projects: 'Proyectos',
      contact: 'Contacto',
    };
    const events = this.currentEvents().filter((event) => event.event_type === 'section_view');
    return toRanking(
      countBy(events, (event) => labels[event.event_name ?? ''] ?? event.event_name),
      events.length,
      6,
    );
  });

  readonly outbound = computed(() => {
    const events = this.currentEvents().filter((event) => event.event_type === 'outbound_click');
    return toRanking(
      countBy(events, (event) => event.event_name),
      events.length,
      6,
    );
  });

  readonly hourly = computed(() => {
    const buckets = Array.from({ length: 24 }, (_, hour) => ({ hour, count: 0 }));
    for (const visit of this.currentVisits()) {
      const hour = new Date(visit.created_at).getHours();
      buckets[hour].count++;
    }
    const max = Math.max(1, ...buckets.map((bucket) => bucket.count));
    return buckets.map((bucket) => ({ ...bucket, pct: Math.round((bucket.count / max) * 100) }));
  });

  readonly conversions = computed<
    { label: string; value: number; hint: string; suffix?: string }[]
  >(() => {
    const events = this.currentEvents();
    const count = (type: string) => events.filter((event) => event.event_type === type).length;
    const contact = count('contact_submit');
    const visitors = this.uniqueVisitors();

    return [
      { label: 'Contactos enviados', value: contact, hint: 'Formulario completado' },
      {
        label: 'Aperturas de proyectos',
        value: count('project_view'),
        hint: 'Detalle de un proyecto',
      },
      {
        label: 'Clics a enlaces externos',
        value: count('outbound_click'),
        hint: 'GitHub, LinkedIn, demos...',
      },
      {
        label: 'Cambios de idioma',
        value: count('language_toggle'),
        hint: 'Interés en versión EN',
      },
      {
        label: 'Tasa de contacto',
        value: visitors ? Math.round((contact / visitors) * 1000) / 10 : 0,
        suffix: '%',
        hint: 'Contactos / visitantes únicos',
      },
    ];
  });

  readonly insights = computed(() => {
    const tips: string[] = [];
    const growth = this.growth();
    const visitors = this.uniqueVisitors();
    const devices = this.devices();
    const countries = this.countries();
    const scroll = this.avgScroll();
    const projects = this.projects();
    const topReferrer = this.referrers()[0];

    if (this.totalVisits() === 0) {
      tips.push(
        'Todavía no hay visitas registradas en este periodo. Comparte el enlace y revisa de nuevo en unas horas.',
      );
      return tips;
    }

    tips.push(
      growth >= 0
        ? `Las visitas crecieron ${growth}% frente al periodo anterior (${this.previousVisits().length} → ${this.totalVisits()}).`
        : `Las visitas bajaron ${Math.abs(growth)}% frente al periodo anterior (${this.previousVisits().length} → ${this.totalVisits()}).`,
    );

    const mobile = devices.find((device) => device.label === 'Móvil');
    if (mobile && mobile.pct >= 50) {
      tips.push(
        `El ${mobile.pct}% entra desde móvil: revisa el preloader, el menú y las animaciones 3D en pantallas pequeñas.`,
      );
    }

    if (countries[0]) {
      tips.push(
        `Tu principal audiencia está en ${countries[0].label} (${countries[0].pct}% de las visitas).`,
      );
    }

    if (topReferrer) {
      tips.push(
        topReferrer.label === 'Directo'
          ? 'La mayoría llega directo. Publicar el enlace en LinkedIn/GitHub o añadir UTM te ayudará a medir qué canal funciona.'
          : `Tu mejor canal es ${topReferrer.label} (${topReferrer.count} visitas). Conviene reforzar ese perfil.`,
      );
    }

    if (scroll > 0 && scroll < 40) {
      tips.push(
        `El scroll promedio es ${scroll}%: muchos no llegan a la sección de proyectos. Acorta el hero o añade un CTA más visible.`,
      );
    } else if (scroll >= 60) {
      tips.push(
        `El scroll promedio es ${scroll}%: el contenido engancha y los visitantes recorren casi toda la página.`,
      );
    }

    if (projects[0]) {
      tips.push(
        `El proyecto más abierto es "${projects[0].label}" (${projects[0].count} veces). Es tu mejor carta de presentación.`,
      );
    }

    const contactEvent = this.currentEvents().filter(
      (event) => event.event_type === 'contact_submit',
    ).length;
    if (visitors >= 10 && contactEvent === 0) {
      tips.push(
        'Hay visitas pero ningún contacto. Prueba un CTA más directo o indica disponibilidad y tiempo de respuesta.',
      );
    }

    return tips.slice(0, 6);
  });

  readonly recentVisits = computed(() => this.currentVisits().slice(0, 15));

  // -------------------------------------------------------------- helpers

  formatDuration(seconds: number): string {
    if (!seconds || seconds < 1) return '0s';
    const minutes = Math.floor(seconds / 60);
    const rest = seconds % 60;
    if (minutes <= 0) return `${rest}s`;
    if (minutes < 60) return `${minutes}m ${rest}s`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  }

  formatDate(value: string): string {
    const date = new Date(value);
    return date.toLocaleString('es-BO', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  relativeTime(value: string | null): string {
    if (!value) return '—';
    const diff = Date.now() - new Date(value).getTime();
    if (diff < 60_000) return 'ahora';
    if (diff < 3_600_000) return `hace ${Math.floor(diff / 60_000)} min`;
    if (diff < 86_400_000) return `hace ${Math.floor(diff / 3_600_000)} h`;
    return `hace ${Math.floor(diff / 86_400_000)} d`;
  }

  deviceIcon(type: string | null): string {
    if (type === 'mobile') return 'smartphone';
    if (type === 'tablet') return 'tablet_mac';
    return 'computer';
  }

  deviceLabel(type: string | null): string {
    if (type === 'mobile') return 'Móvil';
    if (type === 'tablet') return 'Tablet';
    return 'Escritorio';
  }

  flag(code: string): string {
    if (!code || code.length !== 2) return '🌐';
    const upper = code.toUpperCase();
    return String.fromCodePoint(...[...upper].map((char) => 127397 + char.charCodeAt(0)));
  }

  countryName(code: string): string {
    try {
      return new Intl.DisplayNames(['es'], { type: 'region' }).of(code) ?? code;
    } catch {
      return code;
    }
  }

  barHeight(count: number, pct: number): number {
    return count > 0 ? Math.max(pct, 6) : 2;
  }

  trackVisit(index: number, visit: VisitRow): string {
    return visit.id ?? String(index);
  }

  trackEvent(index: number, event: EventRow): string {
    return String(event.id ?? index);
  }

  readonly ranges = [7, 30, 90];
}
