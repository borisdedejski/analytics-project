export interface AnalyticsQueryDto {
  startDate: string;
  endDate: string;
  groupBy?: 'hour' | 'day' | 'week' | 'month';
}

export interface EventCountByTypeDto {
  eventType: string;
  count: number;
}

export interface TimeSeriesDataPointDto {
  timestamp: string;
  count: number;
}

export interface TopPageDto {
  page: string;
  views: number;
}

export interface DeviceStatsDto {
  device: string;
  count: number;
  percentage: number;
}

export interface AnalyticsSummaryDto {
  totalEvents: number;
  uniqueUsers: number;
  eventsByType: EventCountByTypeDto[];
  timeSeriesData: TimeSeriesDataPointDto[];
  topPages: TopPageDto[];
  deviceStats: DeviceStatsDto[];
}

