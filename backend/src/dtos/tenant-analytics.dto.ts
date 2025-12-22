// DTOs for Tenant Analytics API

export interface TenantOverviewQueryDto {
  from: string; // ISO 8601 date string
  to: string;   // ISO 8601 date string
}

export interface TimeSeriesPoint {
  timestamp: string;
  value: number;
}

export interface EventTypeCount {
  eventType: string;
  count: number;
}

export interface TenantOverviewDto {
  activeUsers: number;
  eventsPerMinute: TimeSeriesPoint[];
  topEventTypes: EventTypeCount[];
  dashboardLoadTimeP95: number | null;
  errorRateAvg: number | null;
  freshnessLagSeconds: number;
}

export interface EventQueryDto {
  from: string;
  to: string;
  eventType?: string;
  page?: number;
  limit?: number;
}

export interface EventResponseDto {
  id: string;
  tenantId: string;
  userId: string | null;
  sessionId: string;
  eventType: string;
  timestamp: string;
  metadata: any;
}

export interface PaginatedEventsDto {
  events: EventResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface MetricQueryDto {
  from: string;
  to: string;
  metricName?: string;
  serviceName?: string;
}

export interface MetricTimeSeriesDto {
  serviceName: string;
  metricName: string;
  timeSeries: TimeSeriesPoint[];
}

