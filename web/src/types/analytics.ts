/**
 * Analytics Types
 * 
 * ⚠️ DEPRECATED: This file now re-exports from auto-generated types.
 * 
 * Types are auto-generated from backend DTOs. To update:
 * 1. cd backend
 * 2. npm run types:generate
 * 
 * See TYPE_GENERATION.md for more info.
 */

// Re-export from generated types
export {
  EventCountByTypeDtoSchema as EventCountByTypeSchema,
  TimeSeriesDataPointDtoSchema as TimeSeriesDataPointSchema,
  TopPageDtoSchema as TopPageSchema,
  DeviceStatsDtoSchema as DeviceStatsSchema,
  AnalyticsSummaryDtoSchema as AnalyticsSummarySchema,
  type EventCountByTypeDto as EventCountByType,
  type TimeSeriesDataPointDto as TimeSeriesDataPoint,
  type TopPageDto as TopPage,
  type DeviceStatsDto as DeviceStats,
  type AnalyticsSummaryDto as AnalyticsSummary,
} from './generated/analytics.dto.zod';

