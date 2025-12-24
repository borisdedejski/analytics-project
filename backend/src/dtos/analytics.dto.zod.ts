import { z } from 'zod';

// Query DTO
export const AnalyticsQueryDtoSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
  groupBy: z.enum(['hour', 'day', 'week', 'month']).optional(),
});

export type AnalyticsQueryDto = z.infer<typeof AnalyticsQueryDtoSchema>;

// Event Count By Type
export const EventCountByTypeDtoSchema = z.object({
  eventType: z.string(),
  count: z.number(),
});

export type EventCountByTypeDto = z.infer<typeof EventCountByTypeDtoSchema>;

// Time Series Data Point
export const TimeSeriesDataPointDtoSchema = z.object({
  timestamp: z.string(),
  count: z.number(),
});

export type TimeSeriesDataPointDto = z.infer<typeof TimeSeriesDataPointDtoSchema>;

// Top Page
export const TopPageDtoSchema = z.object({
  page: z.string(),
  views: z.number(),
});

export type TopPageDto = z.infer<typeof TopPageDtoSchema>;

// Device Stats
export const DeviceStatsDtoSchema = z.object({
  device: z.string(),
  count: z.number(),
  percentage: z.number(),
});

export type DeviceStatsDto = z.infer<typeof DeviceStatsDtoSchema>;

// Analytics Summary
export const AnalyticsSummaryDtoSchema = z.object({
  totalEvents: z.number(),
  uniqueUsers: z.number(),
  eventsByType: z.array(EventCountByTypeDtoSchema),
  timeSeriesData: z.array(TimeSeriesDataPointDtoSchema),
  topPages: z.array(TopPageDtoSchema),
  deviceStats: z.array(DeviceStatsDtoSchema),
});

export type AnalyticsSummaryDto = z.infer<typeof AnalyticsSummaryDtoSchema>;

