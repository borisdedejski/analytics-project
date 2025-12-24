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
};

// Legacy exports for backward compatibility
export const getAnalytics = analyticsApi.getSummary;
export const getAnalyticsSafe = analyticsApi.getSummarySafe;
