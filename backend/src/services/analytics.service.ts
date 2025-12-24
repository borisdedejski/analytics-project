import { EventRepository } from "../repositories/event.repository";
import { AnalyticsQueryDto, AnalyticsSummaryDto } from "../dtos/analytics.dto";
import redisClient from "../config/redis";

/**
 * AnalyticsService - Now using Prisma via EventRepository
 *
 * This service maintains backward compatibility while using the new
 * Prisma-based repository under the hood.
 */
export class AnalyticsService {
  private eventRepository: EventRepository;
  private readonly CACHE_TTL = 300;

  constructor() {
    this.eventRepository = new EventRepository();
  }

  /**
   * Clear all analytics cache
   */
  async clearCache(): Promise<void> {
    const keys = await redisClient.keys('analytics:summary:*');
    if (keys.length > 0) {
      await Promise.all(keys.map(key => redisClient.del(key)));
    }
  }

  /**
   * Get analytics summary - now powered by Prisma
   */
  async getAnalyticsSummary(
    query: AnalyticsQueryDto,
    skipCache: boolean = false
  ): Promise<AnalyticsSummaryDto> {
    const cacheKey = `analytics:summary:${query.startDate}:${query.endDate}:${
      query.groupBy || "day"
    }`;

    // Check cache only if not skipping
    if (!skipCache) {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        console.log('Returning cached analytics data');
        return JSON.parse(cached);
      }
    } else {
      console.log('Skipping cache, fetching fresh data');
    }

    // Parse dates as UTC to avoid timezone issues
    // Adding 'T00:00:00Z' ensures consistent UTC parsing
    const startDate = new Date(query.startDate + 'T00:00:00Z');
    const endDate = new Date(query.endDate + 'T00:00:00Z');
    const groupBy = query.groupBy || "day";

    console.log('Analytics Service - Date Processing:', {
      queryStartDate: query.startDate,
      queryEndDate: query.endDate,
      parsedStartDate: startDate.toISOString(),
      parsedEndDate: endDate.toISOString(),
      groupBy
    });

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
}
