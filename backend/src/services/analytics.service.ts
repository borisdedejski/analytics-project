import { EventRepository } from "../repositories/event.repository";
import { AnalyticsQueryDto, AnalyticsSummaryDto } from "../dtos/analytics.dto";
import cacheManager from "./cache-manager.service";

/**
 * AnalyticsService - Enhanced with Smart Caching and Scalability
 *
 * SCALABILITY IMPROVEMENTS:
 * - Uses CacheManager with smart invalidation (no blocking KEYS operations)
 * - Time-based cache tiering for optimal TTL
 * - Tag-based cache invalidation for targeted updates
 * - Supports multi-tenant isolation
 * - Probabilistic cache stampede prevention
 */
export class AnalyticsService {
  private eventRepository: EventRepository;
  private readonly CACHE_NAMESPACE = "analytics";

  constructor() {
    this.eventRepository = new EventRepository();
  }

  /**
   * Clear analytics cache using smart invalidation
   */
  async clearCache(tenantId?: string): Promise<void> {
    if (tenantId) {
      await cacheManager.invalidateByTenant(tenantId);
    } else {
      await cacheManager.invalidateByNamespace(this.CACHE_NAMESPACE);
    }
  }

  /**
   * Invalidate cache when new events are created
   */
  async invalidateCacheForNewEvent(
    tenantId: string,
    eventDate: Date
  ): Promise<void> {
    // Invalidate by tags - much more efficient than scanning all keys
    const tags = [
      `tenant:${tenantId}`,
      `date:${eventDate.toISOString().split("T")[0]}`,
      `realtime`,
    ];
    await cacheManager.invalidateByTags(tags);
  }

  /**
   * Get analytics summary with enhanced caching
   */
  async getAnalyticsSummary(
    query: AnalyticsQueryDto,
    tenantId?: string,
    skipCache: boolean = false
  ): Promise<AnalyticsSummaryDto> {
    const cacheIdentifier = `summary:${query.startDate}:${query.endDate}:${
      query.groupBy || "day"
    }`;

    const startDate = new Date(query.startDate + "T00:00:00Z");
    const endDate = new Date(query.endDate + "T00:00:00Z");
    const groupBy = query.groupBy || "day";

    // Generate cache tags for smart invalidation
    const tags = this.generateCacheTags(tenantId, startDate, endDate);

    // Check cache only if not skipping
    if (!skipCache) {
      const cached = await cacheManager.get<AnalyticsSummaryDto>(
        this.CACHE_NAMESPACE,
        cacheIdentifier,
        {
          tenantId,
          dateRange: { start: startDate, end: endDate },
          tags,
        }
      );

      if (cached) {
        return cached;
      }
    } else {
      console.log("Skipping cache, fetching fresh data");
    }

    const [
      totalEvents,
      uniqueUsers,
      eventsByType,
      timeSeriesData,
      topPages,
      deviceStats,
    ] = await Promise.all([
      this.eventRepository.getTotalCount(startDate, endDate, tenantId),
      this.eventRepository.getUniqueUserCount(startDate, endDate, tenantId),
      this.eventRepository.getEventCountByType(startDate, endDate, tenantId),
      this.eventRepository.getTimeSeriesData(startDate, endDate, groupBy, tenantId),
      this.eventRepository.getTopPages(startDate, endDate, 10, tenantId),
      this.eventRepository.getDeviceStats(startDate, endDate, tenantId),
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

    // Cache with smart TTL and tags
    await cacheManager.set(this.CACHE_NAMESPACE, cacheIdentifier, summary, {
      tenantId,
      dateRange: { start: startDate, end: endDate },
      tags,
    });

    return summary;
  }

  /**
   * Generate cache tags for smart invalidation
   */
  private generateCacheTags(
    tenantId: string | undefined,
    startDate: Date,
    endDate: Date
  ): string[] {
    const tags: string[] = [];

    if (tenantId) {
      tags.push(`tenant:${tenantId}`);
    }

    const startDateStr = startDate.toISOString().split("T")[0];
    const endDateStr = endDate.toISOString().split("T")[0];
    tags.push(`date:${startDateStr}`, `date:${endDateStr}`);

    const today = new Date().toISOString().split("T")[0];
    if (endDateStr === today) {
      tags.push("realtime");
    }

    return tags;
  }

  /**
   * Get cache statistics
   */
  async getCacheStats() {
    return await cacheManager.getStats();
  }
}
