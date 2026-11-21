import { Injectable } from '@angular/core';
import { getApiUrl, isApiConfigured } from '../../core/api';

const TOKEN_KEY = 'portfolio:admin-token';
const EMAIL_KEY = 'portfolio:admin-email';

export interface VisitRow {
  id: string;
  visitor_id: string;
  session_id: string;
  path: string | null;
  referrer: string | null;
  referrer_host: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  country_code: string | null;
  country_name: string | null;
  city: string | null;
  device_type: string | null;
  browser: string | null;
  os: string | null;
  screen_width: number | null;
  screen_height: number | null;
  language: string | null;
  timezone: string | null;
  duration_seconds: number;
  scroll_depth: number;
  created_at: string;
  last_seen_at: string | null;
}

export interface EventRow {
  id: number;
  visitor_id: string;
  session_id: string;
  visit_id: string | null;
  event_type: string;
  event_name: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface DashboardData {
  visits: VisitRow[];
  events: EventRow[];
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  async load(days: number): Promise<DashboardData> {
    if (!isApiConfigured()) throw new Error('El backend no está configurado.');

    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) throw new Error('Sesión no iniciada.');

    const response = await fetch(`${getApiUrl()}/analytics/dashboard?days=${days}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      await this.signOut();
      throw new Error('Tu sesión expiró. Vuelve a iniciar sesión.');
    }

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { message?: string } | null;
      throw new Error(body?.message || 'No se pudieron cargar las estadísticas.');
    }

    return (await response.json()) as DashboardData;
  }

  async getSession(): Promise<{ user: { email: string | null } } | null> {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token || this.isTokenExpired(token)) {
      await this.signOut();
      return null;
    }

    const email = localStorage.getItem(EMAIL_KEY);
    return { user: { email } };
  }

  async signIn(email: string, password: string): Promise<void> {
    if (!isApiConfigured()) throw new Error('El backend no está configurado.');

    const payload: { password: string; email?: string } = { password };
    if (email.trim()) payload.email = email.trim();

    const response = await fetch(`${getApiUrl()}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = (await response.json().catch(() => null)) as {
      accessToken?: string;
      email?: string;
      message?: string | string[];
    } | null;

    if (!response.ok || !data?.accessToken) {
      const message = Array.isArray(data?.message) ? data.message[0] : data?.message;
      throw new Error(message || 'Credenciales incorrectas.');
    }

    localStorage.setItem(TOKEN_KEY, data.accessToken);
    localStorage.setItem(EMAIL_KEY, data.email || email.trim() || 'admin');
  }

  async signOut(): Promise<void> {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EMAIL_KEY);
  }

  async cleanupBots(): Promise<{ deletedVisits: number; deletedEvents: number }> {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) throw new Error('Sesión no iniciada.');

    const response = await fetch(`${getApiUrl()}/analytics/bots`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('No se pudieron limpiar los bots.');
    return (await response.json()) as { deletedVisits: number; deletedEvents: number };
  }

  async resetAll(): Promise<{ deletedVisits: number; deletedEvents: number }> {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) throw new Error('Sesión no iniciada.');

    const response = await fetch(`${getApiUrl()}/analytics/reset`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('No se pudo reiniciar la analítica.');
    return (await response.json()) as { deletedVisits: number; deletedEvents: number };
  }

  private isTokenExpired(token: string): boolean {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return true;
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64)) as { exp?: number };
      if (!payload.exp) return false;
      return payload.exp * 1000 <= Date.now();
    } catch {
      return true;
    }
  }
}
