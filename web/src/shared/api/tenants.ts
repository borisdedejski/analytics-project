import { apiClient } from './client';
import type { 
  TenantOverviewDto, 
  TenantOverviewQueryDto,
  PaginatedEventsDto,
  EventQueryDto,
  MetricTimeSeriesDto,
  MetricQueryDto
} from '../../types/generated/tenant-analytics.dto.zod';
import { 
  TenantOverviewDtoSchema,
  PaginatedEventsDtoSchema,
  MetricTimeSeriesDtoSchema
} from '../../types/generated/tenant-analytics.dto.zod';

export const tenantsApi = {
  /**
   * Get tenant overview with runtime validation
   */
  getOverview: async (tenantId: string, params: TenantOverviewQueryDto): Promise<TenantOverviewDto> => {
    const data = await apiClient.get<TenantOverviewDto>(
      `/api/tenants/${tenantId}/overview`,
      params
    );
    
    // Runtime validation
    return TenantOverviewDtoSchema.parse(data);
  },

  /**
   * Get paginated events for a tenant
   */
  getEvents: async (tenantId: string, params: EventQueryDto): Promise<PaginatedEventsDto> => {
    const data = await apiClient.get<PaginatedEventsDto>(
      `/api/tenants/${tenantId}/events`,
      params
    );
    
    // Runtime validation
    return PaginatedEventsDtoSchema.parse(data);
  },

  /**
   * Get metrics time series for a tenant
   */
  getMetrics: async (tenantId: string, params: MetricQueryDto): Promise<MetricTimeSeriesDto[]> => {
    const data = await apiClient.get<MetricTimeSeriesDto[]>(
      `/api/tenants/${tenantId}/metrics`,
      params
    );
    
    // Validate each metric in the array
    return data.map(metric => MetricTimeSeriesDtoSchema.parse(metric));
  },
};
