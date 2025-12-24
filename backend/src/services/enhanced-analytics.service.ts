/**
 * Enhanced Analytics Service
 *
 * This service extends the original AnalyticsService with Prisma-based
 * tenant analytics while maintaining backward compatibility.
 *
 * Use this as a reference for migrating from TypeORM to Prisma.
 */

import { PrismaClient } from "@prisma/client";
import { EventRepository } from "../repositories/event.repository";
import { AnalyticsQueryDto, AnalyticsSummaryDto } from "../dtos";
import redisClient from "../config/redis";

const prisma = new PrismaClient();

export class EnhancedAnalyticsService {
  private eventRepository: EventRepository;
  private readonly CACHE_TTL = 300;

  constructor() {
    this.eventRepository = new EventRepository();
  }

  /**
   * Original getAnalyticsSummary - uses TypeORM
   * Kept for backward compatibility
   */
  async getAnalyticsSummary(
    query: AnalyticsQueryDto
  ): Promise<AnalyticsSummaryDto> {
    const cacheKey = `analytics:summary:${query.startDate}:${query.endDate}:${
      query.groupBy || "day"
    }`;

    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const startDate = new Date(query.startDate);
    const endDate = new Date(query.endDate);
    const groupBy = query.groupBy || "day";

    const [
      totalEvents,
      uniqueUsers,
      eventsByType,
      timeSeriesData,
      topPages,
      deviceStats,
    ] = await Promise.all([
      this.eventRepository.getTotalCount(startDate, endDate),
      this.eventRepository.getUniqueUserCount(startDate, endDate),
      this.eventRepository.getEventCountByType(startDate, endDate),
      this.eventRepository.getTimeSeriesData(startDate, endDate, groupBy),
      this.eventRepository.getTopPages(startDate, endDate, 10),
      this.eventRepository.getDeviceStats(startDate, endDate),
    ]);

    const totalDeviceCount = deviceStats.reduce(
      (sum: number, stat: any) => sum + parseInt(stat.count),
      0
    );
    const deviceStatsWithPercentage = deviceStats.map((stat: any) => ({
      device: stat.device,
      count: parseInt(stat.count),
      percentage:
        totalDeviceCount > 0
          ? (parseInt(stat.count) / totalDeviceCount) * 100
          : 0,
    }));

    const summary: AnalyticsSummaryDto = {
      totalEvents,
      uniqueUsers,
      eventsByType: eventsByType.map((item: any) => ({
        eventType: item.eventtype,
        count: parseInt(item.count),
      })),
      timeSeriesData: timeSeriesData.map((item: any) => ({
        timestamp: item.timestamp,
        count: parseInt(item.count),
      })),
      topPages: topPages.map((item: any) => ({
        page: item.page,
        views: parseInt(item.views),
      })),
      deviceStats: deviceStatsWithPercentage,
    };

    await redisClient.setEx(cacheKey, this.CACHE_TTL, JSON.stringify(summary));

    return summary;
  }

  /**
   * NEW: Enhanced summary with Prisma
   * Includes additional metrics like click patterns, user engagement, etc.
   */
  async getEnhancedSummary(
    tenantId: string,
    startDate: Date,
    endDate: Date
  ): Promise<any> {
    const cacheKey = `analytics:enhanced:${tenantId}:${startDate.toISOString()}:${endDate.toISOString()}`;

    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // Use Prisma for more detailed analytics
    const [
      activeUsers,
      totalEvents,
      eventsByType,
      topPages,
      clickPatterns,
      deviceBreakdown,
      countryBreakdown,
      avgSessionEvents,
    ] = await Promise.all([
      // Active users
      prisma.event.findMany({
        where: {
          tenantId,
          timestamp: { gte: startDate, lte: endDate },
          userId: { not: null },
        },
        select: { userId: true },
        distinct: ["userId"],
      }),

      // Total events
      prisma.event.count({
        where: {
          tenantId,
          timestamp: { gte: startDate, lte: endDate },
        },
      }),

      // Events by type
      prisma.event.groupBy({
        by: ["eventType"],
        where: {
          tenantId,
          timestamp: { gte: startDate, lte: endDate },
        },
        _count: { eventType: true },
        orderBy: { _count: { eventType: "desc" } },
      }),

      // Top pages (using metadata)
      prisma.$queryRaw<Array<{ page: string; count: bigint }>>`
        SELECT 
          metadata->>'page' as page,
          COUNT(*) as count
        FROM events
        WHERE "tenantId" = ${tenantId}
          AND timestamp >= ${startDate}
          AND timestamp <= ${endDate}
          AND metadata->>'page' IS NOT NULL
        GROUP BY metadata->>'page'
        ORDER BY count DESC
        LIMIT 10
      `,

      // Click patterns (button clicks)
      prisma.$queryRaw<Array<{ button: string; count: bigint }>>`
        SELECT 
          metadata->>'button' as button,
          COUNT(*) as count
        FROM events
        WHERE "tenantId" = ${tenantId}
          AND timestamp >= ${startDate}
          AND timestamp <= ${endDate}
          AND "eventType" = 'button_click'
          AND metadata->>'button' IS NOT NULL
        GROUP BY metadata->>'button'
        ORDER BY count DESC
        LIMIT 10
      `,

      // Device breakdown
      prisma.$queryRaw<Array<{ device: string; count: bigint }>>`
        SELECT 
          metadata->>'device' as device,
          COUNT(*) as count
        FROM events
        WHERE "tenantId" = ${tenantId}
          AND timestamp >= ${startDate}
          AND timestamp <= ${endDate}
          AND metadata->>'device' IS NOT NULL
        GROUP BY metadata->>'device'
        ORDER BY count DESC
      `,

      // Country breakdown
      prisma.$queryRaw<Array<{ country: string; count: bigint }>>`
        SELECT 
          metadata->>'country' as country,
          COUNT(*) as count
        FROM events
        WHERE "tenantId" = ${tenantId}
          AND timestamp >= ${startDate}
          AND timestamp <= ${endDate}
          AND metadata->>'country' IS NOT NULL
        GROUP BY metadata->>'country'
        ORDER BY count DESC
        LIMIT 10
      `,

      // Average events per session
      prisma.$queryRaw<Array<{ avg_events: number }>>`
        SELECT AVG(event_count) as avg_events
        FROM (
          SELECT "sessionId", COUNT(*) as event_count
          FROM events
          WHERE "tenantId" = ${tenantId}
            AND timestamp >= ${startDate}
            AND timestamp <= ${endDate}
          GROUP BY "sessionId"
        ) session_counts
      `,
    ]);

    const summary = {
      // Basic metrics
      activeUsers: activeUsers.length,
      totalEvents,
      avgEventsPerSession: avgSessionEvents[0]?.avg_events || 0,

      // Event breakdown
      eventsByType: eventsByType.map((e: any) => ({
        eventType: e.eventType,
        count: e._count.eventType,
      })),

      // Page analytics
      topPages: topPages.map((p: any) => ({
        page: p.page,
        views: Number(p.count),
      })),

      // User interaction
      clickPatterns: clickPatterns.map((c: any) => ({
        button: c.button,
        clicks: Number(c.count),
      })),

      // Demographics
      deviceBreakdown: deviceBreakdown.map((d: any) => ({
        device: d.device,
        count: Number(d.count),
      })),
      countryBreakdown: countryBreakdown.map((c: any) => ({
        country: c.country,
        count: Number(c.count),
      })),
    };

    await redisClient.setEx(cacheKey, this.CACHE_TTL, JSON.stringify(summary));

    return summary;
  }

  /**
   * NEW: Get user journey for a specific session
   */
  async getUserJourney(tenantId: string, sessionId: string): Promise<any> {
    const events = await prisma.event.findMany({
      where: {
        tenantId,
        sessionId,
      },
      orderBy: {
        timestamp: "asc",
      },
      select: {
        id: true,
        eventType: true,
        timestamp: true,
        metadata: true,
      },
    });

    return {
      sessionId,
      eventCount: events.length,
      duration:
        events.length > 1
          ? events[events.length - 1].timestamp.getTime() -
            events[0].timestamp.getTime()
          : 0,
      events: events.map((e: any) => ({
        eventType: e.eventType,
        timestamp: e.timestamp,
        page: (e.metadata as any)?.page,
        action: (e.metadata as any)?.button || (e.metadata as any)?.feature,
      })),
    };
  }

  /**
   * NEW: Get performance metrics for a tenant
   */
  async getPerformanceMetrics(
    tenantId: string,
    startDate: Date,
    endDate: Date
  ): Promise<any> {
    const [latencyP95, latencyP99, errorRate, requestsPerSec] =
      await Promise.all([
        prisma.metric.aggregate({
          where: {
            tenantId,
            metricName: "api_latency_ms_p95",
            timestamp: { gte: startDate, lte: endDate },
          },
          _avg: { value: true },
          _max: { value: true },
          _min: { value: true },
        }),

        prisma.metric.aggregate({
          where: {
            tenantId,
            metricName: "api_latency_ms_p99",
            timestamp: { gte: startDate, lte: endDate },
          },
          _avg: { value: true },
          _max: { value: true },
          _min: { value: true },
        }),

        prisma.metric.aggregate({
          where: {
            tenantId,
            metricName: "error_rate",
            timestamp: { gte: startDate, lte: endDate },
          },
          _avg: { value: true },
          _max: { value: true },
        }),

        prisma.metric.aggregate({
          where: {
            tenantId,
            metricName: "requests_per_sec",
            timestamp: { gte: startDate, lte: endDate },
          },
          _avg: { value: true },
          _max: { value: true },
        }),
      ]);

    return {
      latency: {
        p95: {
          avg: latencyP95._avg.value,
          max: latencyP95._max.value,
          min: latencyP95._min.value,
        },
        p99: {
          avg: latencyP99._avg.value,
          max: latencyP99._max.value,
          min: latencyP99._min.value,
        },
      },
      errorRate: {
        avg: errorRate._avg.value,
        max: errorRate._max.value,
      },
      throughput: {
        avg: requestsPerSec._avg.value,
        max: requestsPerSec._max.value,
      },
    };
  }
}
