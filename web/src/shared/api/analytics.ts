import { apiClient } from './client';
import type { AnalyticsSummaryDto, AnalyticsQueryDto } from '../../types/generated/analytics.dto.zod';
import { AnalyticsSummaryDtoSchema } from '../../types/generated/analytics.dto.zod';
import { ZodError } from 'zod';

export interface GetAnalyticsParams {
  tenantId?: string;
  startDate: string;
  endDate: string;
  groupBy?: 'hour' | 'day' | 'week' | 'month';
}

export interface GetPaginatedAnalyticsParams extends GetAnalyticsParams {
  cursor?: string;
  limit?: number;
}

export interface PaginatedAnalyticsResponse {
  data: AnalyticsSummaryDto;
  pagination: {
    cursor: string | null;
    nextCursor: string | null;
    hasMore: boolean;
    limit: number;
    total: number;
  };
}

/**
 * Custom error class for validation errors
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public zodError: ZodError
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Analytics API with comprehensive runtime validation
 */
export const analyticsApi = {
  /**
   * Fetches analytics summary with runtime type validation via Zod
   * Throws ValidationError if backend response doesn't match expected schema
   */
  async getSummary(params: GetAnalyticsParams): Promise<AnalyticsSummaryDto> {
    const { tenantId, startDate, endDate, groupBy } = params;

    try {
      const headers: Record<string, string> = {};
      if (tenantId) {
        headers['x-tenant-id'] = tenantId;
      }

      const response = await apiClient.get<AnalyticsSummaryDto>(
        '/analytics/summary',
        {
          startDate,
          endDate,
          groupBy,
        },
        headers
      );

      // Runtime validation with Zod - will throw if backend response doesn't match expected schema
      const validated = AnalyticsSummaryDtoSchema.parse(response);
      
      console.log('✅ Analytics data validated successfully', {
        totalEvents: validated.totalEvents,
        uniqueUsers: validated.uniqueUsers,
        eventTypes: validated.eventsByType.length,
      });

      return validated;
    } catch (error) {
      if (error instanceof ZodError) {
        console.error('❌ Analytics validation failed:', {
          errors: error.errors,
          issues: error.issues.map(issue => ({
            path: issue.path.join('.'),
            message: issue.message,
            code: issue.code,
          })),
        });
        throw new ValidationError(
          'Backend response does not match expected schema. The API may have changed.',
          error
        );
      }
      throw error;
    }
  },

  /**
   * Safe version that returns validation errors instead of throwing
   * Useful for scenarios where you want to handle validation errors gracefully
   */
  async getSummarySafe(params: GetAnalyticsParams) {
    try {
      const { tenantId, startDate, endDate, groupBy } = params;

      const headers: Record<string, string> = {};
      if (tenantId) {
        headers['x-tenant-id'] = tenantId;
      }

      const response = await apiClient.get<AnalyticsSummaryDto>(
        '/analytics/summary',
        {
          startDate,
          endDate,
          groupBy,
        },
        headers
      );

      const result = AnalyticsSummaryDtoSchema.safeParse(response);
      
      if (result.success) {
        console.log('✅ Analytics data validated successfully (safe mode)');
        return { success: true as const, data: result.data };
      } else {
        console.error('❌ Analytics validation failed (safe mode):', result.error.errors);
        return { 
          success: false as const, 
          error: result.error,
          validationErrors: result.error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message,
          })),
        };
      }
    } catch (error) {
      console.error('❌ Analytics fetch failed:', error);
      return { 
        success: false as const, 
        error: error instanceof Error ? error : new Error('Unknown error'),
      };
    }
  },

  /**
   * Clear analytics cache for a tenant
   */
  async clearCache(tenantId?: string): Promise<void> {
    try {
      const headers: Record<string, string> = {};
      if (tenantId) {
        headers['x-tenant-id'] = tenantId;
      }
      
      await apiClient.post('/analytics/cache/clear', {}, headers);
      console.log('🗑️ Cache cleared successfully');
    } catch (error) {
      console.error('Failed to clear cache:', error);
      throw error;
    }
  },

  /**
   * Fetches paginated analytics summary with cursor-based pagination
   */
  async getPaginatedSummary(params: GetPaginatedAnalyticsParams): Promise<PaginatedAnalyticsResponse> {
    const { tenantId, startDate, endDate, groupBy, cursor, limit = 50 } = params;

    try {
      const headers: Record<string, string> = {};
      if (tenantId) {
        headers['x-tenant-id'] = tenantId;
      }

      const queryParams: Record<string, string> = {
        startDate,
        endDate,
        limit: String(limit),
      };

      if (groupBy) {
        queryParams.groupBy = groupBy;
      }

      if (cursor) {
        queryParams.cursor = cursor;
      }

      const response = await apiClient.get<PaginatedAnalyticsResponse>(
        '/analytics/summary/paginated',
        queryParams,
        headers
      );

      console.log('✅ Paginated analytics data fetched', {
        hasMore: response.pagination.hasMore,
        limit: response.pagination.limit,
        total: response.pagination.total,
      });

      return response;
    } catch (error) {
      console.error('❌ Paginated analytics fetch failed:', error);
      throw error;
    }
  },

  /**
   * Creates an EventSource for streaming analytics updates
   * Returns a function to close the stream
   */
  createStreamConnection(
    params: GetAnalyticsParams,
    onData: (data: AnalyticsSummaryDto) => void,
    onError?: (error: Error) => void
  ): () => void {
    const { tenantId, startDate, endDate, groupBy } = params;

    const queryParams = new URLSearchParams({
      startDate,
      endDate,
      ...(groupBy && { groupBy }),
    });

    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const url = `${baseUrl}/api/analytics/summary/stream?${queryParams}`;

    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const validated = AnalyticsSummaryDtoSchema.parse(data);
        onData(validated);
      } catch (error) {
        console.error('Error parsing stream data:', error);
        if (onError) {
          onError(error as Error);
        }
      }
    };

    eventSource.onerror = (error) => {
      console.error('Stream error:', error);
      if (onError) {
        onError(new Error('Stream connection error'));
      }
      eventSource.close();
    };

    // Return cleanup function
    return () => {
      eventSource.close();
    };
  },
};

// Legacy exports for backward compatibility
export const getAnalytics = analyticsApi.getSummary;
export const getAnalyticsSafe = analyticsApi.getSummarySafe;
