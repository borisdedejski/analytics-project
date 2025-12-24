import { z } from 'zod';

// Tenant Overview Query DTO
export const TenantOverviewQueryDtoSchema = z.object({
  from: z.string(),
  to: z.string(),
});

export type TenantOverviewQueryDto = z.infer<typeof TenantOverviewQueryDtoSchema>;

// Time Series Point
export const TimeSeriesPointSchema = z.object({
  timestamp: z.string(),
  value: z.number(),
});

export type TimeSeriesPoint = z.infer<typeof TimeSeriesPointSchema>;

// Event Type Count
export const EventTypeCountSchema = z.object({
  eventType: z.string(),
  count: z.number(),
});

export type EventTypeCount = z.infer<typeof EventTypeCountSchema>;

// Tenant Overview DTO
export const TenantOverviewDtoSchema = z.object({
  activeUsers: z.number(),
  eventsPerMinute: z.array(TimeSeriesPointSchema),
  topEventTypes: z.array(EventTypeCountSchema),
  dashboardLoadTimeP95: z.number().nullable(),
  errorRateAvg: z.number().nullable(),
  freshnessLagSeconds: z.number(),
});

export type TenantOverviewDto = z.infer<typeof TenantOverviewDtoSchema>;

// Event Query DTO
export const EventQueryDtoSchema = z.object({
  from: z.string(),
  to: z.string(),
  eventType: z.string().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

export type EventQueryDto = z.infer<typeof EventQueryDtoSchema>;

// Event Response DTO (for tenant analytics)
export const TenantAnalyticsEventResponseDtoSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  userId: z.string().nullable(),
  sessionId: z.string(),
  eventType: z.string(),
  timestamp: z.string(),
  metadata: z.any(),
});

export type TenantAnalyticsEventResponseDto = z.infer<typeof TenantAnalyticsEventResponseDtoSchema>;

// Paginated Events DTO
export const PaginatedEventsDtoSchema = z.object({
  events: z.array(TenantAnalyticsEventResponseDtoSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export type PaginatedEventsDto = z.infer<typeof PaginatedEventsDtoSchema>;

// Metric Query DTO
export const MetricQueryDtoSchema = z.object({
  from: z.string(),
  to: z.string(),
  metricName: z.string().optional(),
  serviceName: z.string().optional(),
});

export type MetricQueryDto = z.infer<typeof MetricQueryDtoSchema>;

// Metric Time Series DTO
export const MetricTimeSeriesDtoSchema = z.object({
  serviceName: z.string(),
  metricName: z.string(),
  timeSeries: z.array(TimeSeriesPointSchema),
});

export type MetricTimeSeriesDto = z.infer<typeof MetricTimeSeriesDtoSchema>;

