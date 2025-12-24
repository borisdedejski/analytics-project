import { useQuery, useQueryClient } from "@tanstack/react-query";
import { analyticsApi, ValidationError } from "@/shared/api/analytics";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useRef } from "react";
import type { AnalyticsSummaryDto } from "@/types/generated/analytics.dto.zod";
import { AnalyticsSummaryDtoSchema } from "@/types/generated/analytics.dto.zod";
import { ZodError } from "zod";

interface UseAnalyticsParams {
  startDate: string | null;
  endDate: string | null;
  groupBy: "hour" | "day" | "week" | "month";
  enabled?: boolean;
  tenantId?: string;
  onValidationError?: (error: ValidationError) => void;
}

const calculateStaleTime = (endDate: string | null): number => {
  if (!endDate) return 0;

  const end = new Date(endDate);
  const now = new Date();
  const daysOld = (now.getTime() - end.getTime()) / (1000 * 60 * 60 * 24);

  if (daysOld < 0) {
    // Future date (including today)
    return 30 * 1000; // 30 seconds
  } else if (daysOld < 7) {
    // Recent data (< 7 days)
    return 5 * 60 * 1000; // 5 minutes
  } else {
    // Historical data (> 7 days)
    return 60 * 60 * 1000; // 1 hour
  }
};

const calculateRefetchInterval = (endDate: string | null): number | false => {
  if (!endDate) return false;

  const end = new Date(endDate);
  const now = new Date();
  const isToday = end.toDateString() === now.toDateString();

  if (isToday) {
    // Realtime data: refetch every 30 seconds
    return 30 * 1000;
  } else if (now.getTime() - end.getTime() < 7 * 24 * 60 * 60 * 1000) {
    // Recent data: refetch every 5 minutes
    return 5 * 60 * 1000;
  }

  // Historical data: don't auto-refetch
  return false;
};

export const useAnalytics = ({
  startDate,
  endDate,
  groupBy,
  enabled = true,
  tenantId: providedTenantId,
  onValidationError,
}: UseAnalyticsParams) => {
  const queryClient = useQueryClient();
  const previousDataRef = useRef<AnalyticsSummaryDto | null>(null);
  const { currentUser } = useAuthStore();

  const tenantId = providedTenantId || currentUser?.tenantId;

  const staleTime = calculateStaleTime(endDate);
  const refetchInterval = calculateRefetchInterval(endDate);

  const analyticsQuery = useQuery<AnalyticsSummaryDto, Error>({
    queryKey: ["analytics", startDate, endDate, groupBy, tenantId],
    queryFn: async () => {
      console.log("🔄 Fetching analytics with runtime validation...", {
        startDate,
        endDate,
        groupBy,
        tenantId,
      });

      try {
        const data = await analyticsApi.getSummary({
          startDate: startDate!,
          endDate: endDate!,
          groupBy,
          tenantId,
        });

        try {
          const revalidated = AnalyticsSummaryDtoSchema.parse(data);
          return revalidated;
        } catch (zodError) {
          if (zodError instanceof ZodError) {
            const validationError = new ValidationError(
              "Data validation failed in hook layer",
              zodError
            );
            onValidationError?.(validationError);
            throw validationError;
          }
          throw zodError;
        }
      } catch (error) {
        if (error instanceof ValidationError) {
          onValidationError?.(error);
        }
        throw error;
      }
    },
    enabled: enabled && !!startDate && !!endDate,
    staleTime,
    refetchInterval,
    refetchIntervalInBackground: true,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: (failureCount, error) => {
      if (error instanceof ValidationError) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  useEffect(() => {
    if (analyticsQuery.data) {
      previousDataRef.current = analyticsQuery.data;
    }
  }, [analyticsQuery.data]);

  const isValidData = (data: unknown): data is AnalyticsSummaryDto => {
    return (
      data !== null &&
      data !== undefined &&
      typeof data === "object" &&
      "totalEvents" in data &&
      "uniqueUsers" in data &&
      "eventsByType" in data &&
      "timeSeriesData" in data &&
      "topPages" in data &&
      "deviceStats" in data
    );
  };

  return {
    ...analyticsQuery,
    data:
      analyticsQuery.data && isValidData(analyticsQuery.data)
        ? analyticsQuery.data
        : undefined,
    invalidate: () => {
      queryClient.invalidateQueries({
        queryKey: ["analytics", startDate, endDate, groupBy, tenantId],
      });
    },
    optimisticUpdate: (
      updater: (data: AnalyticsSummaryDto) => AnalyticsSummaryDto
    ) => {
      if (previousDataRef.current) {
        queryClient.setQueryData<AnalyticsSummaryDto>(
          ["analytics", startDate, endDate, groupBy, tenantId],
          updater(previousDataRef.current)
        );
      }
    },
    hasValidData: !!analyticsQuery.data && isValidData(analyticsQuery.data),
  };
};
