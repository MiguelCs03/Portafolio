import { Injectable } from '@angular/core';
import { getSupabase } from '../../core/supabase';

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
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase no está configurado.');

    const since = new Date(Date.now() - days * 86_400_000).toISOString();

    const [visitsResult, eventsResult] = await Promise.all([
      supabase
        .from('portfolio_visits')
        .select('*')
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .limit(10_000),
      supabase
        .from('portfolio_events')
        .select('*')
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .limit(10_000),
    ]);

    if (visitsResult.error) throw visitsResult.error;
    if (eventsResult.error) throw eventsResult.error;

    return {
      visits: (visitsResult.data ?? []) as VisitRow[],
      events: (eventsResult.data ?? []) as EventRow[],
    };
  }

  async getSession() {
    const supabase = getSupabase();
    if (!supabase) return null;

    const { data } = await supabase.auth.getSession();
    return data.session;
  }

  async signIn(email: string, password: string) {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase no está configurado.');

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  async signOut() {
    const supabase = getSupabase();
    if (!supabase) return;
    await supabase.auth.signOut();
  }
}
