import { TestBed } from '@angular/core/testing';
import { Admin } from './admin';
import { EventRow, VisitRow } from './admin.service';

function visit(overrides: Partial<VisitRow>): VisitRow {
  return {
    id: 'visit-1',
    visitor_id: 'visitor-1',
    session_id: 'session-1',
    path: '/',
    referrer: null,
    referrer_host: null,
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    country_code: 'BO',
    country_name: 'Bolivia',
    city: 'Santa Cruz',
    device_type: 'mobile',
    browser: 'Chrome',
    os: 'Android',
    screen_width: 390,
    screen_height: 844,
    language: 'es-BO',
    timezone: 'America/La_Paz',
    duration_seconds: 60,
    scroll_depth: 70,
    created_at: new Date().toISOString(),
    last_seen_at: new Date().toISOString(),
    ...overrides,
  };
}

function event(overrides: Partial<EventRow>): EventRow {
  return {
    id: 1,
    visitor_id: 'visitor-1',
    session_id: 'session-1',
    visit_id: 'visit-1',
    event_type: 'project_view',
    event_name: 'Multipuntos Multicenter',
    metadata: {},
    created_at: new Date().toISOString(),
    ...overrides,
  };
}

describe('Admin', () => {
  function create() {
    const fixture = TestBed.createComponent(Admin);
    const component = fixture.componentInstance as any;

    Object.defineProperty(component, 'configured', { value: true });
    component.session.set({ email: 'owner@example.com' });
    component.updatedAt.set(new Date());
    component.data.set({
      visits: [
        visit({ id: 'a' }),
        visit({
          id: 'b',
          visitor_id: 'visitor-2',
          session_id: 'session-2',
          device_type: 'desktop',
          country_code: 'US',
          country_name: 'Estados Unidos',
          referrer_host: 'linkedin.com',
          scroll_depth: 40,
          duration_seconds: 120,
        }),
      ],
      events: [
        event({ id: 1 }),
        event({ id: 2, event_type: 'section_view', event_name: 'projects' }),
        event({ id: 3, event_type: 'outbound_click', event_name: 'github.com' }),
        event({ id: 4, event_type: 'contact_submit', event_name: 'formulario' }),
      ],
    });

    return { fixture, component };
  }

  it('calcula las métricas principales', () => {
    const { component } = create();

    expect(component.totalVisits()).toBe(2);
    expect(component.uniqueVisitors()).toBe(2);
    expect(component.totalSessions()).toBe(2);
    expect(component.chart().points.length).toBe(7);
    expect(component.countries().length).toBe(2);
    expect(component.projects()[0].label).toBe('Multipuntos Multicenter');
    expect(component.insights().length).toBeGreaterThan(0);
    expect(component.conversions().some((item: { suffix?: string }) => item.suffix === '%')).toBe(
      true,
    );
  });

  it('renderiza el dashboard con datos sin errores', () => {
    const { fixture } = create();
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Panel del portafolio');
    expect(text).toContain('Visitantes únicos');
    expect(text).toContain('Bolivia');
    expect(text).toContain('Multipuntos Multicenter');
  });
});
