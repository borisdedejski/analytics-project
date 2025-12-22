import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "@/shared/api/analytics";
import { useAnalyticsStore } from "@/store/analyticsStore";
import { format } from "date-fns";

export const useAnalytics = () => {
  const { dateRange, groupBy } = useAnalyticsStore();

  const analyticsQuery = useQuery({
    queryKey: ["analytics", dateRange, groupBy],
    queryFn: () =>
      analyticsApi.getSummary({
        startDate: format(dateRange.startDate, "yyyy-MM-dd"),
        endDate: format(dateRange.endDate, "yyyy-MM-dd"),
        groupBy,
      }),
    refetchInterval: 30000,
  });

  console.log(analyticsQuery);

  return {
    ...analyticsQuery,
  };
};
