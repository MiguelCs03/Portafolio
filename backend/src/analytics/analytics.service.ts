import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TrackEventDto } from './dto/track-event.dto';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

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
      d.setDate(d.getDate() + i);
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
