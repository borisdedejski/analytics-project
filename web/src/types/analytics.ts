import { z } from 'zod';

export const EventCountByTypeSchema = z.object({
  eventType: z.string(),
  count: z.number(),
});

export const TimeSeriesDataPointSchema = z.object({
  timestamp: z.string(),
  count: z.number(),
});

export const TopPageSchema = z.object({
  page: z.string(),
  views: z.number(),
});

export const DeviceStatsSchema = z.object({
  device: z.string(),
  count: z.number(),
  percentage: z.number(),
});

export const AnalyticsSummarySchema = z.object({
  totalEvents: z.number(),
  uniqueUsers: z.number(),
  eventsByType: z.array(EventCountByTypeSchema),
  timeSeriesData: z.array(TimeSeriesDataPointSchema),
  topPages: z.array(TopPageSchema),
  deviceStats: z.array(DeviceStatsSchema),
});

export type AnalyticsSummary = z.infer<typeof AnalyticsSummarySchema>;
export type EventCountByType = z.infer<typeof EventCountByTypeSchema>;
export type TimeSeriesDataPoint = z.infer<typeof TimeSeriesDataPointSchema>;
export type TopPage = z.infer<typeof TopPageSchema>;
export type DeviceStats = z.infer<typeof DeviceStatsSchema>;

