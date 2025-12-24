import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { format, addDays, isSameDay } from 'date-fns';
import { useAnalytics } from '@/features/analytics/hooks/useAnalytics';
import { useAnalyticsStore } from '@/store/analyticsStore';
import { useAuthStore } from '@/store/authStore';
import { analyticsApi, ValidationError } from '@/shared/api/analytics';
import type { AnalyticsSummaryDto } from '@/types/generated/analytics.dto.zod';

interface UseDashboardOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onValidationError?: (error: ValidationError) => void;
}

export const useDashboard = (options?: UseDashboardOptions) => {
  const { onSuccess, onError, onValidationError } = options || {};
  const queryClient = useQueryClient();
  const { currentUser } = useAuthStore();
  const { dateRange, groupBy, setDateRange, setGroupBy } = useAnalyticsStore();
  
  const [localDateRange, setLocalDateRange] = useState<[Date | null, Date | null]>([
    dateRange.startDate,
    dateRange.endDate,
  ]);

  const formattedDates = useMemo(() => {
    const startDate = dateRange.startDate
      ? format(dateRange.startDate, 'yyyy-MM-dd')
      : null;
    const endDate = dateRange.endDate
      ? format(addDays(dateRange.endDate, 1), 'yyyy-MM-dd')
      : null;

    return { startDate, endDate };
  }, [dateRange.startDate, dateRange.endDate]);

  const handleValidationError = useCallback((error: ValidationError) => {
    onValidationError?.(error);
    onError?.(error);
  }, [onValidationError, onError]);

  const { data, isLoading, error, isFetching, hasValidData } = useAnalytics({
    startDate: formattedDates.startDate,
    endDate: formattedDates.endDate,
    groupBy,
    onValidationError: handleValidationError,
  });

  useEffect(() => {
    setLocalDateRange([dateRange.startDate, dateRange.endDate]);
  }, [dateRange.startDate, dateRange.endDate]);

  const handleDateRangeChange = useCallback((dates: [Date | null, Date | null] | null) => {
    if (dates) {
      const [start, end] = dates;
      setLocalDateRange([start, end]);
      
      if (start && end) {
        setDateRange({ startDate: start, endDate: end });
      }
    } else {
      setLocalDateRange([null, null]);
      setDateRange({ startDate: null, endDate: null });
    }
  }, [setDateRange]);

  const handleGroupByChange = useCallback((value: string | null) => {
    if (value) {
      setGroupBy(value as 'hour' | 'day' | 'week' | 'month');
    }
  }, [setGroupBy]);

  const fetchAnalytics = useCallback(async () => {
    try {
      await analyticsApi.clearCache(currentUser?.tenantId);
      await queryClient.invalidateQueries({ queryKey: ['analytics'] });
      onSuccess?.();
    } catch (error) {
      onError?.(error as Error);
    }
  }, [queryClient, currentUser?.tenantId, onSuccess, onError]);

  const hasValidDateRange = !!(dateRange.startDate && dateRange.endDate);
  const isSingleDay = !!(dateRange.startDate && dateRange.endDate && 
    isSameDay(dateRange.startDate, dateRange.endDate));

  const validatedData: AnalyticsSummaryDto | undefined = hasValidData ? data : undefined;

  useEffect(() => {
    if (data && hasValidData) {
    }
  }, [data, hasValidData]);

  return {
    data: validatedData,
    isLoading,
    error,
    isFetching,
    hasValidData,
    
    dateRange,
    localDateRange,
    groupBy,
    
    handleDateRangeChange,
    handleGroupByChange,
    fetchAnalytics,
    
    hasValidDateRange,
    isSingleDay,
  };
};
