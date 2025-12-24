import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "@/shared/api/analytics";

interface UseAnalyticsParams {
  startDate: string | null;
  endDate: string | null;
  groupBy: "hour" | "day" | "week" | "month";
  enabled?: boolean;
}

export const useAnalytics = ({
  startDate,
  endDate,
  groupBy,
  enabled = true,
}: UseAnalyticsParams) => {
  const analyticsQuery = useQuery({
    queryKey: ["analytics", startDate, endDate, groupBy],
    queryFn: () =>
      analyticsApi.getSummary({
        startDate: startDate!,
        endDate: endDate!,
        groupBy,
      }),
    enabled: enabled && !!startDate && !!endDate,
    refetchInterval: 5000, // Refresh every 5 seconds for real-time feel
    refetchIntervalInBackground: true, // Continue refreshing even when tab is not focused
    staleTime: 0, // Consider data stale immediately
    gcTime: 0, // Don't keep unused data in cache
  });

  return {
    ...analyticsQuery,
  };
};
