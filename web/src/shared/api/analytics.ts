import { apiClient } from "./client";
import { AnalyticsSummary, AnalyticsSummarySchema } from "@/types/analytics";

export interface AnalyticsParams {
  startDate: string;
  endDate: string;
  groupBy?: "hour" | "day" | "week" | "month";
  skipCache?: boolean;
}

export const analyticsApi = {
  getSummary: async (params: AnalyticsParams): Promise<AnalyticsSummary> => {
    const queryParams: any = {
      startDate: params.startDate,
      endDate: params.endDate,
      groupBy: params.groupBy,
    };

    if (params.skipCache) {
      queryParams.skipCache = "true";
    }

    const data = await apiClient.get<AnalyticsSummary>(
      "/analytics/summary",
      queryParams
    );
    return AnalyticsSummarySchema.parse(data);
  },

  clearCache: async (): Promise<void> => {
    await apiClient.post("/analytics/clear-cache");
  },
};
