import { PrismaClient } from '@prisma/client';
import {
  TenantOverviewDto,
  TenantOverviewQueryDto,
  EventQueryDto,
  PaginatedEventsDto,
  MetricQueryDto,
  MetricTimeSeriesDto,
  TimeSeriesPoint,
  EventTypeCount,
} from '../dtos/tenant-analytics.dto';

const prisma = new PrismaClient();

export class TenantAnalyticsService {
  /**
   * GET /api/tenants/:tenantId/overview?from=ISO&to=ISO
   * Returns overview metrics for a tenant
   */
  async getTenantOverview(
    tenantId: string,
    query: TenantOverviewQueryDto
  ): Promise<TenantOverviewDto> {
    const from = new Date(query.from);
    const to = new Date(query.to);

    // Execute all queries in parallel for performance
    const [
      activeUsersResult,
      eventsPerMinuteRaw,
      topEventTypesRaw,
      dashboardLoadTimeP95,
      errorRateAvg,
      freshnessResult,
    ] = await Promise.all([
      // 1. Active users (unique users in range)
      prisma.event.findMany({
        where: {
          tenantId,
          timestamp: { gte: from, lte: to },
          userId: { not: null },
        },
        select: { userId: true },
        distinct: ['userId'],
      }),

      // 2. Events per minute time series
      prisma.$queryRaw<Array<{ minute: Date; count: bigint }>>`
        SELECT 
          DATE_TRUNC('minute', timestamp) as minute,
          COUNT(*) as count
        FROM events
        WHERE "tenantId" = ${tenantId}
          AND timestamp >= ${from}
          AND timestamp <= ${to}
        GROUP BY minute
        ORDER BY minute ASC
      `,

      // 3. Top event types
      prisma.event.groupBy({
        by: ['eventType'],
        where: {
          tenantId,
          timestamp: { gte: from, lte: to },
        },
        _count: { eventType: true },
        orderBy: { _count: { eventType: 'desc' } },
        take: 10,
      }),

      // 4. Dashboard load time P95 from metrics
      prisma.metric.aggregate({
        where: {
          tenantId,
          metricName: 'api_latency_ms_p95',
          timestamp: { gte: from, lte: to },
        },
        _avg: { value: true },
      }),

      // 5. Error rate average
      prisma.metric.aggregate({
        where: {
          tenantId,
          metricName: 'error_rate',
          timestamp: { gte: from, lte: to },
        },
        _avg: { value: true },
      }),

      // 6. Freshness lag (now - max event timestamp)
      prisma.event.aggregate({
        where: { tenantId },
        _max: { timestamp: true },
      }),
    ]);

    // Process results
    const activeUsers = activeUsersResult.length;

    const eventsPerMinute: TimeSeriesPoint[] = eventsPerMinuteRaw.map((row: any) => ({
      timestamp: row.minute.toISOString(),
      value: Number(row.count),
    }));

    const topEventTypes: EventTypeCount[] = topEventTypesRaw.map((row: any) => ({
      eventType: row.eventType,
      count: row._count.eventType,
    }));

    const freshnessLagSeconds =
      freshnessResult._max.timestamp
        ? Math.floor((Date.now() - freshnessResult._max.timestamp.getTime()) / 1000)
        : 0;

    return {
      activeUsers,
      eventsPerMinute,
      topEventTypes,
      dashboardLoadTimeP95: dashboardLoadTimeP95._avg.value || null,
      errorRateAvg: errorRateAvg._avg.value || null,
      freshnessLagSeconds,
    };
  }

  /**
   * GET /api/tenants/:tenantId/events?from&to&eventType&page&limit
   * Returns paginated events sorted by timestamp desc
   */
  async getTenantEvents(
    tenantId: string,
    query: EventQueryDto
  ): Promise<PaginatedEventsDto> {
    const from = new Date(query.from);
    const to = new Date(query.to);
    const page = query.page || 1;
    const limit = Math.min(query.limit || 50, 1000); // Max 1000 per page
    const skip = (page - 1) * limit;

    const where = {
      tenantId,
      timestamp: { gte: from, lte: to },
      ...(query.eventType && { eventType: query.eventType }),
    };

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        skip,
        take: limit,
      }),
      prisma.event.count({ where }),
    ]);

    return {
      events: events.map((e: any) => ({
        id: e.id,
        tenantId: e.tenantId,
        userId: e.userId,
        sessionId: e.sessionId,
        eventType: e.eventType,
        timestamp: e.timestamp.toISOString(),
        metadata: e.metadata,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * GET /api/tenants/:tenantId/metrics?from&to&metricName&serviceName
   * Returns time series bucketed by minute with avg(value)
   */
  async getTenantMetrics(
    tenantId: string,
    query: MetricQueryDto
  ): Promise<MetricTimeSeriesDto[]> {
    const from = new Date(query.from);
    const to = new Date(query.to);

    const where = {
      tenantId,
      timestamp: { gte: from, lte: to },
      ...(query.metricName && { metricName: query.metricName }),
      ...(query.serviceName && { serviceName: query.serviceName }),
    };

    // Get distinct service + metric combinations
    const combinations = await prisma.metric.findMany({
      where,
      select: {
        serviceName: true,
        metricName: true,
      },
      distinct: ['serviceName', 'metricName'],
    });

    // For each combination, get time series data
    const results = await Promise.all(
      combinations.map(async ({ serviceName, metricName }: any) => {
        const timeSeriesRaw = await prisma.$queryRaw<
          Array<{ minute: Date; avg_value: number }>
        >`
          SELECT 
            DATE_TRUNC('minute', timestamp) as minute,
            AVG(value) as avg_value
          FROM metrics
          WHERE "tenantId" = ${tenantId}
            AND "serviceName" = ${serviceName}
            AND "metricName" = ${metricName}
            AND timestamp >= ${from}
            AND timestamp <= ${to}
          GROUP BY minute
          ORDER BY minute ASC
        `;

        return {
          serviceName,
          metricName,
          timeSeries: timeSeriesRaw.map((row: any) => ({
            timestamp: row.minute.toISOString(),
            value: Number(row.avg_value),
          })),
        };
      })
    );

    return results;
  }
}

