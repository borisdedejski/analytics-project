import { useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, subDays } from 'date-fns';
import { useAuthStore } from '@/store/authStore';
import { eventsApi, EventsResponse } from '@/shared/api/events';
import { analyticsApi } from '@/shared/api/analytics';

interface UseEventLogOptions {
  initialStartDate?: Date;
  initialEndDate?: Date;
  initialEventType?: string;
  initialPageSize?: number;
}

export const useEventLog = (options?: UseEventLogOptions) => {
  const { currentUser } = useAuthStore();
  
  const [startDate, setStartDate] = useState<Date>(
    options?.initialStartDate || subDays(new Date(), 7)
  );
  const [endDate, setEndDate] = useState<Date>(
    options?.initialEndDate || new Date()
  );
  const [eventType, setEventType] = useState<string | null>(
    options?.initialEventType || null
  );
  const [pageSize, setPageSize] = useState<number>(options?.initialPageSize || 50);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [eventTypes, setEventTypes] = useState<string[]>([]);

  // Fetch available event types for filter
  useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        const summary = await analyticsApi.getSummary({
          tenantId: currentUser?.tenantId,
          startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
          endDate: format(new Date(), 'yyyy-MM-dd'),
        });
        const types = summary.eventsByType.map(e => e.eventType);
        setEventTypes(types);
      } catch (error) {
        console.error('Failed to fetch event types:', error);
      }
    };

    if (currentUser?.tenantId) {
      fetchEventTypes();
    }
  }, [currentUser?.tenantId]);

  // React Query for fetching individual events
  const {
    data,
    isLoading,
    error,
    isFetching,
    refetch,
  } = useQuery<EventsResponse, Error>({
    queryKey: [
      'eventLog',
      currentUser?.tenantId,
      format(startDate, 'yyyy-MM-dd'),
      format(endDate, 'yyyy-MM-dd'),
      eventType,
      pageSize,
      currentPage,
    ],
    queryFn: async () => {
      const response = await eventsApi.getEvents({
        tenantId: currentUser?.tenantId,
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
        eventType: eventType || undefined,
        page: currentPage,
        limit: pageSize,
      });
      return response;
    },
    enabled: !!currentUser?.tenantId,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Pagination handlers
  const totalPages = data ? Math.ceil(data.total / pageSize) : 0;
  
  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, totalPages]);

  const handlePreviousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage]);

  const handleRefresh = useCallback(() => {
    setCurrentPage(1);
    refetch();
  }, [refetch]);

  // Filter handlers
  const handleStartDateChange = useCallback((date: Date | null) => {
    if (date) {
      setStartDate(date);
      setCurrentPage(1);
    }
  }, []);

  const handleEndDateChange = useCallback((date: Date | null) => {
    if (date) {
      setEndDate(date);
      setCurrentPage(1);
    }
  }, []);

  const handleEventTypeChange = useCallback((value: string | null) => {
    setEventType(value);
    setCurrentPage(1);
  }, []);

  const handlePageSizeChange = useCallback((value: string | null) => {
    if (value) {
      setPageSize(Number(value));
      setCurrentPage(1);
    }
  }, []);

  // Helper function for event type badge colors
  const getEventTypeColor = useCallback((type: string) => {
    const colorMap: Record<string, string> = {
      'click': 'blue',
      'view': 'cyan',
      'page_view': 'cyan',
      'purchase': 'green',
      'signup': 'violet',
      'login': 'indigo',
      'logout': 'gray',
      'button_click': 'blue',
      'form_submit': 'teal',
    };
    return colorMap[type] || 'gray';
  }, []);

  const canGoBack = currentPage > 1;
  const canGoForward = currentPage < totalPages;

  return {
    // Data
    data,
    isLoading,
    error,
    isFetching,

    // Filters
    startDate,
    endDate,
    eventType,
    eventTypes,
    pageSize,

    // Filter handlers
    handleStartDateChange,
    handleEndDateChange,
    handleEventTypeChange,
    handlePageSizeChange,

    // Pagination
    currentPage,
    totalPages,
    canGoBack,
    canGoForward,
    handleNextPage,
    handlePreviousPage,
    handleRefresh,

    // Helpers
    getEventTypeColor,
  };
};

