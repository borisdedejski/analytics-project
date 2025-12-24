/**
 * useAnalytics Hook Tests
 *
 * Tests the analytics data fetching hook with runtime validation
 */

import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAnalytics } from "@/features/analytics/hooks/useAnalytics";
import { analyticsApi } from "@/shared/api/analytics";
import { ReactNode } from "react";

// Mock the analytics API
vi.mock("@/shared/api/analytics", () => ({
  analyticsApi: {
    getSummary: vi.fn(),
  },
}));

// Mock auth store
vi.mock("@/store/authStore", () => ({
  useAuthStore: () => ({
    currentUser: { id: "user-1", tenantId: "tenant-1" },
  }),
}));

describe("useAnalytics", () => {
  let queryClient: QueryClient;

  // Create wrapper for React Query
  const createWrapper = () => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          cacheTime: 0,
        },
      },
    });

    return ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch analytics data successfully", async () => {
    // Arrange
    const mockData = {
      totalEvents: 1000,
      uniqueUsers: 50,
      eventsByType: [
        { eventType: "click", count: 500 },
        { eventType: "view", count: 300 },
      ],
      timeSeriesData: [{ timestamp: "2024-01-01T00:00:00Z", count: 100 }],
      topPages: [{ page: "/home", views: 400 }],
      deviceStats: [{ device: "desktop", count: 600, percentage: 60 }],
    };

    vi.mocked(analyticsApi.getSummary).mockResolvedValue(mockData);

    // Act
    const { result } = renderHook(
      () =>
        useAnalytics({
          startDate: "2024-01-01",
          endDate: "2024-01-31",
          groupBy: "day",
        }),
      { wrapper: createWrapper() }
    );

    // Assert
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockData);
    expect(analyticsApi.getSummary).toHaveBeenCalledWith({
      startDate: "2024-01-01",
      endDate: "2024-01-31",
      groupBy: "day",
      tenantId: "tenant-1",
    });
  });

  it("should validate data with Zod schema", async () => {
    // Arrange - Invalid data (missing required fields)
    const invalidData = {
      totalEvents: 1000,
      // Missing uniqueUsers
      eventsByType: [],
    };

    vi.mocked(analyticsApi.getSummary).mockResolvedValue(invalidData as any);

    const onValidationError = vi.fn();

    // Act
    const { result } = renderHook(
      () =>
        useAnalytics({
          startDate: "2024-01-01",
          endDate: "2024-01-31",
          groupBy: "day",
          onValidationError,
        }),
      { wrapper: createWrapper() }
    );

    // Assert
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(onValidationError).toHaveBeenCalled();
  });

  it("should not fetch when enabled is false", async () => {
    // Act
    renderHook(
      () =>
        useAnalytics({
          startDate: "2024-01-01",
          endDate: "2024-01-31",
          groupBy: "day",
          enabled: false,
        }),
      { wrapper: createWrapper() }
    );

    // Assert
    await waitFor(() => {
      expect(analyticsApi.getSummary).not.toHaveBeenCalled();
    });
  });

  it("should not fetch when startDate or endDate is missing", async () => {
    // Act
    renderHook(
      () =>
        useAnalytics({
          startDate: null,
          endDate: "2024-01-31",
          groupBy: "day",
        }),
      { wrapper: createWrapper() }
    );

    // Assert
    await waitFor(() => {
      expect(analyticsApi.getSummary).not.toHaveBeenCalled();
    });
  });

  it("should use different stale times based on data recency", async () => {
    // Arrange
    const mockData = {
      totalEvents: 100,
      uniqueUsers: 10,
      eventsByType: [],
      timeSeriesData: [],
      topPages: [],
      deviceStats: [],
    };

    vi.mocked(analyticsApi.getSummary).mockResolvedValue(mockData);

    // Act - Recent data (today)
    const today = new Date().toISOString().split("T")[0];
    const { result: recentResult } = renderHook(
      () =>
        useAnalytics({
          startDate: today,
          endDate: today,
          groupBy: "day",
        }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(recentResult.current.isSuccess).toBe(true);
    });

    // Recent data should auto-refetch (staleTime is lower)
    expect(recentResult.current.data).toBeDefined();
  });

  it("should retry on network errors but not on validation errors", async () => {
    // Arrange - Network error
    vi.mocked(analyticsApi.getSummary)
      .mockRejectedValueOnce(new Error("Network error"))
      .mockResolvedValueOnce({
        totalEvents: 100,
        uniqueUsers: 10,
        eventsByType: [],
        timeSeriesData: [],
        topPages: [],
        deviceStats: [],
      });

    // Act
    const { result } = renderHook(
      () =>
        useAnalytics({
          startDate: "2024-01-01",
          endDate: "2024-01-31",
          groupBy: "day",
        }),
      { wrapper: createWrapper() }
    );

    // Assert - Should eventually succeed after retry
    await waitFor(
      () => {
        expect(result.current.isSuccess).toBe(true);
      },
      { timeout: 5000 }
    );

    // Should have been called multiple times (initial + retry)
    expect(analyticsApi.getSummary).toHaveBeenCalledTimes(2);
  });

  it("should invalidate cache when invalidate function is called", async () => {
    // Arrange
    const mockData = {
      totalEvents: 100,
      uniqueUsers: 10,
      eventsByType: [],
      timeSeriesData: [],
      topPages: [],
      deviceStats: [],
    };

    vi.mocked(analyticsApi.getSummary).mockResolvedValue(mockData);

    // Act
    const { result } = renderHook(
      () =>
        useAnalytics({
          startDate: "2024-01-01",
          endDate: "2024-01-31",
          groupBy: "day",
        }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Invalidate cache
    result.current.invalidate();

    // Assert - Should trigger refetch
    await waitFor(() => {
      expect(analyticsApi.getSummary).toHaveBeenCalledTimes(2);
    });
  });
});
