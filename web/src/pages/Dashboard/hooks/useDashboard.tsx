import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { format, addDays, isSameDay } from 'date-fns';
import { useAnalytics } from '@/features/analytics/hooks/useAnalytics';
import { useAnalyticsStore } from '@/store/analyticsStore';
import { analyticsApi } from '@/shared/api/analytics';

interface UseDashboardOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useDashboard = (options?: UseDashboardOptions) => {
  const { onSuccess, onError } = options || {};
  const queryClient = useQueryClient();
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

  const { data, isLoading, error, isFetching } = useAnalytics({
    startDate: formattedDates.startDate,
    endDate: formattedDates.endDate,
    groupBy,
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
      await analyticsApi.clearCache();
      await queryClient.invalidateQueries({ queryKey: ['analytics'] });
      onSuccess?.();
    } catch (error) {
      onError?.(error as Error);
    }
  }, [queryClient, onSuccess, onError]);

  const hasValidDateRange = !!(dateRange.startDate && dateRange.endDate);
  const isSingleDay = !!(dateRange.startDate && dateRange.endDate && 
    isSameDay(dateRange.startDate, dateRange.endDate));

  return {
    // Data
    data,
    isLoading,
    error,
    isFetching,
    
    // State
    dateRange,
    localDateRange,
    groupBy,
    
    // Handlers
    handleDateRangeChange,
    handleGroupByChange,
    fetchAnalytics,
    
    // Computed
    hasValidDateRange,
    isSingleDay,
  };
};
