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
   * Get analytics summary - now powered by Prisma
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
}
