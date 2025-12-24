import { useState, useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { isSameDay } from "date-fns";
import { useAnalytics } from "@/features/analytics/hooks/useAnalytics";
import { useAnalyticsStore } from "@/store/analyticsStore";
import { useAuthStore } from "@/store/authStore";
import { analyticsApi } from "@/shared/api/analytics";

export const useDashboard = () => {
  const queryClient = useQueryClient();
  const { currentUser } = useAuthStore();
  const { data, isLoading, error, isFetching } = useAnalytics();
  const { dateRange, groupBy, setDateRange, setGroupBy } = useAnalyticsStore();

  const [localDateRange, setLocalDateRange] = useState<
    [Date | null, Date | null]
  >([dateRange.startDate, dateRange.endDate]);

  // Sync local state with store
  useEffect(() => {
    setLocalDateRange([dateRange.startDate, dateRange.endDate]);
  }, [dateRange.startDate, dateRange.endDate]);

  // Handle errors with notifications
  useEffect(() => {
    if (error) {
      notifications.show({
        title: "Analytics Failed",
        message:
          (error as Error).message ||
          "Failed to load analytics data. Please try again.",
        color: "red",
        icon: <IconX size={18} />,
        autoClose: 7000,
      });
    }
  }, [error]);

  // Show success notification when data loads successfully after error
  useEffect(() => {
    if (data && !isLoading && !error) {
      const hasShownError = sessionStorage.getItem("analytics-error-shown");
      if (hasShownError === "true") {
        notifications.show({
          title: "Success",
          message: "Analytics data loaded successfully",
          color: "green",
          icon: <IconCheck size={18} />,
          autoClose: 3000,
        });
        sessionStorage.removeItem("analytics-error-shown");
      }
    }
  }, [data, isLoading, error]);

  // Track error state for success notification
  useEffect(() => {
    if (error) {
      sessionStorage.setItem("analytics-error-shown", "true");
    }
  }, [error]);

  // Handle date range changes
  const handleDateRangeChange = useCallback(
    (dates: [Date | null, Date | null] | null) => {
      console.log("DatePicker onChange triggered:", dates);

      if (dates) {
        const [start, end] = dates;
        // Update local state immediately to show selection in UI
        setLocalDateRange([start, end]);

        // Update store when both dates are selected (including same date twice)
        if (start && end) {
          console.log("Both dates selected, updating store:", {
            startDate: start,
            endDate: end,
          });
          setDateRange({ startDate: start, endDate: end });
        } else if (start && !end) {
          // First date selected, waiting for second date
          console.log("Waiting for complete date range selection");
        }
      } else {
        // Handle clear action
        setLocalDateRange([null, null]);
        setDateRange({ startDate: null, endDate: null });
      }
    },
    [setDateRange]
  );

  // Handle group by changes
  const handleGroupByChange = useCallback(
    (value: string | null) => {
      console.log("GroupBy changed to:", value);
      if (value) {
        setGroupBy(value as "hour" | "day" | "week" | "month");
      }
    },
    [setGroupBy]
  );

  // Handle refresh with notifications
  const handleRefresh = useCallback(async () => {
    try {
      await analyticsApi.clearCache(currentUser?.tenantId);
      await queryClient.invalidateQueries({ queryKey: ["analytics"] });

      notifications.show({
        title: "Dashboard Refreshed",
        message: "Analytics data has been refreshed successfully",
        color: "blue",
        icon: <IconCheck size={18} />,
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Failed to refresh analytics:", error);

      notifications.show({
        title: "Refresh Failed",
        message:
          error instanceof Error
            ? error.message
            : "Failed to refresh analytics. Please try again.",
        color: "red",
        icon: <IconX size={18} />,
        autoClose: 7000,
      });
    }
  }, [queryClient, currentUser?.tenantId]);

  // Computed values
  const hasValidDateRange = !!(dateRange.startDate && dateRange.endDate);
  const isSingleDay = !!(
    dateRange.startDate &&
    dateRange.endDate &&
    isSameDay(dateRange.startDate, dateRange.endDate)
  );

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
    handleRefresh,

    // Computed
    hasValidDateRange,
    isSingleDay,
  };
};
