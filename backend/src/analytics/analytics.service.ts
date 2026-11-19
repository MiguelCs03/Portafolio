import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { TrackEventDto } from './dto/track-event.dto';
import { CreateEventDto, CreateVisitDto, TouchVisitDto } from './dto/visit.dto';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async createVisit(dto: CreateVisitDto, fallbackCountry?: string) {
    const visit = await this.prisma.portfolioVisit.create({
      data: {
        id: dto.id,
        visitorId: dto.visitor_id,
        sessionId: dto.session_id,
        path: dto.path ?? '/',
        referrer: dto.referrer ?? null,
        referrerHost: dto.referrer_host ?? null,
        utmSource: dto.utm_source ?? null,
        utmMedium: dto.utm_medium ?? null,
        utmCampaign: dto.utm_campaign ?? null,
        countryCode: dto.country_code ?? fallbackCountry ?? null,
        countryName: dto.country_name ?? null,
        city: dto.city ?? null,
        deviceType: dto.device_type ?? null,
        browser: dto.browser ?? null,
        os: dto.os ?? null,
        screenWidth: dto.screen_width ?? null,
        screenHeight: dto.screen_height ?? null,
        language: dto.language ?? null,
        timezone: dto.timezone ?? null,
        durationSeconds: 0,
        scrollDepth: 0,
      },
    });
    return { id: visit.id };
  }

  async touchVisit(id: string, dto: TouchVisitDto) {
    const existing = await this.prisma.portfolioVisit.findUnique({
      where: { id },
      select: { durationSeconds: true, scrollDepth: true },
    });
    if (!existing) return { ok: false };

    const seconds = Math.max(
      existing.durationSeconds,
      Math.min(Math.max(dto.duration_seconds, 0), 7200),
    );
    const scroll = Math.max(
      existing.scrollDepth,
      Math.min(Math.max(dto.scroll_depth, 0), 100),
    );

    await this.prisma.portfolioVisit.update({
      where: { id },
      data: {
        durationSeconds: seconds,
        scrollDepth: scroll,
        lastSeenAt: new Date(),
      },
    });

    return { ok: true };
  }

  async createEvent(dto: CreateEventDto) {
    const event = await this.prisma.portfolioEvent.create({
      data: {
        visitorId: dto.visitor_id,
        sessionId: dto.session_id,
        visitId: dto.visit_id ?? null,
        eventType: dto.event_type,
        eventName: dto.event_name ?? null,
        metadata: (dto.metadata ?? {}) as Prisma.InputJsonValue,
      },
    });
    return { id: event.id };
  }

  async getDashboard(days: number) {
    const clampedDays = Math.min(Math.max(Math.round(days) || 14, 1), 365);
    const since = new Date(Date.now() - clampedDays * 86_400_000);

    const [visits, events] = await Promise.all([
      this.prisma.portfolioVisit.findMany({
        where: { createdAt: { gte: since } },
        orderBy: { createdAt: 'desc' },
        take: 10_000,
      }),
      this.prisma.portfolioEvent.findMany({
        where: { createdAt: { gte: since } },
        orderBy: { createdAt: 'desc' },
        take: 10_000,
      }),
    ]);

    return {
      visits: visits.map((v) => ({
        id: v.id,
        visitor_id: v.visitorId,
        session_id: v.sessionId,
        path: v.path,
        referrer: v.referrer,
        referrer_host: v.referrerHost,
        utm_source: v.utmSource,
        utm_medium: v.utmMedium,
        utm_campaign: v.utmCampaign,
        country_code: v.countryCode,
        country_name: v.countryName,
        city: v.city,
        device_type: v.deviceType,
        browser: v.browser,
        os: v.os,
        screen_width: v.screenWidth,
        screen_height: v.screenHeight,
        language: v.language,
        timezone: v.timezone,
        duration_seconds: v.durationSeconds,
        scroll_depth: v.scrollDepth,
        created_at: v.createdAt.toISOString(),
        last_seen_at: v.lastSeenAt.toISOString(),
      })),
      events: events.map((e) => ({
        id: e.id,
        visitor_id: e.visitorId,
        session_id: e.sessionId,
        visit_id: e.visitId,
        event_type: e.eventType,
        event_name: e.eventName,
        metadata: (e.metadata as Record<string, unknown>) ?? {},
        created_at: e.createdAt.toISOString(),
      })),
    };
  }

  async track(
    dto: TrackEventDto,
    meta: { userAgent?: string; country?: string },
  ) {
    return this.prisma.analyticsEvent.create({
      data: {
        type: dto.type,
        path: dto.path,
        target: dto.target,
        referrer: dto.referrer,
        device: dto.device ?? this.detectDevice(meta.userAgent),
        userAgent: meta.userAgent?.slice(0, 300),
        country: meta.country,
      },
    });
  }

  async getSummary() {
    const now = new Date();
    const startOfToday = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    );
    const sevenDaysAgo = new Date(startOfToday);
    sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 6);
    const fourteenDaysAgo = new Date(startOfToday);
    fourteenDaysAgo.setUTCDate(fourteenDaysAgo.getUTCDate() - 13);

    const [
      totalViews,
      viewsToday,
      viewsLast7Days,
      totalProjectClicks,
      topTargets,
      deviceBreakdown,
      recentEvents,
      dailyRaw,
    ] = await Promise.all([
      this.prisma.analyticsEvent.count({ where: { type: 'page_view' } }),
      this.prisma.analyticsEvent.count({
        where: { type: 'page_view', createdAt: { gte: startOfToday } },
      }),
      this.prisma.analyticsEvent.count({
        where: { type: 'page_view', createdAt: { gte: sevenDaysAgo } },
      }),
      this.prisma.analyticsEvent.count({ where: { type: 'project_click' } }),
      this.prisma.analyticsEvent.groupBy({
        by: ['target', 'type'],
        where: { target: { not: null } },
        _count: { target: true },
        orderBy: { _count: { target: 'desc' } },
        take: 10,
      }),
      this.prisma.analyticsEvent.groupBy({
        by: ['device'],
        where: { type: 'page_view' },
        _count: { device: true },
      }),
      this.prisma.analyticsEvent.findMany({
        orderBy: { createdAt: 'desc' },
        take: 15,
        select: {
          id: true,
          type: true,
          path: true,
          target: true,
          device: true,
          country: true,
          createdAt: true,
        },
      }),
      this.prisma.analyticsEvent.findMany({
        where: { type: 'page_view', createdAt: { gte: fourteenDaysAgo } },
        select: { createdAt: true },
      }),
    ]);

    const dailyMap = new Map<string, number>();
    for (let i = 0; i < 14; i++) {
      const d = new Date(fourteenDaysAgo);
      d.setUTCDate(d.getUTCDate() + i);
      dailyMap.set(d.toISOString().slice(0, 10), 0);
    }
    for (const row of dailyRaw) {
      const key = row.createdAt.toISOString().slice(0, 10);
      dailyMap.set(key, (dailyMap.get(key) ?? 0) + 1);
    }

    return {
      totals: {
        totalViews,
        viewsToday,
        viewsLast7Days,
        totalProjectClicks,
      },
      topTargets: topTargets.map((item) => ({
        target: item.target,
        type: item.type,
        count: item._count.target,
      })),
      devices: deviceBreakdown.map((item) => ({
        device: item.device ?? 'unknown',
        count: item._count.device,
      })),
      dailyViews: Array.from(dailyMap.entries()).map(([date, count]) => ({
        date,
        count,
      })),
      recentEvents,
    };
  }

  private detectDevice(userAgent?: string): string {
    if (!userAgent) return 'desktop';
    const ua = userAgent.toLowerCase();
    if (/tablet|ipad/.test(ua)) return 'tablet';
    if (/mobile|android|iphone/.test(ua)) return 'mobile';
    return 'desktop';
  }
}
