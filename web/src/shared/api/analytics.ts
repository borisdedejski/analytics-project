import { apiClient } from './client';
import { AnalyticsSummary, AnalyticsSummarySchema } from '@/types/analytics';

export interface AnalyticsParams {
  startDate: string;
  endDate: string;
  groupBy?: 'hour' | 'day' | 'week' | 'month';
}

export const analyticsApi = {
  getSummary: async (params: AnalyticsParams): Promise<AnalyticsSummary> => {
    const data = await apiClient.get<AnalyticsSummary>('/analytics/summary', params);
    return AnalyticsSummarySchema.parse(data);
  },
};

