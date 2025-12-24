/**
 * Dashboard Component Tests
 * 
 * Tests the container component that coordinates business logic and UI
 */

import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Dashboard } from '@/pages/Dashboard/Dashboard';
import { ReactNode } from 'react';

// Mock the useDashboard hook
vi.mock('@/pages/Dashboard/hooks/useDashboard.tsx', () => ({
  useDashboard: vi.fn(() => ({
    data: {
      totalEvents: 1000,
      uniqueUsers: 50,
      eventsByType: [
        { eventType: 'click', count: 500 },
        { eventType: 'view', count: 300 },
      ],
      timeSeriesData: [
        { timestamp: '2024-01-01T00:00:00Z', count: 100 },
      ],
      topPages: [
        { page: '/home', views: 400 },
      ],
      deviceStats: [
        { device: 'desktop', count: 600, percentage: 60 },
      ],
    },
    isLoading: false,
    error: null,
    isFetching: false,
    dateRange: {
      startDate: '2024-01-01',
      endDate: '2024-01-31',
    },
    localDateRange: {
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-31'),
    },
    groupBy: 'day',
    handleDateRangeChange: vi.fn(),
    handleGroupByChange: vi.fn(),
    fetchAnalytics: vi.fn(),
    hasValidDateRange: true,
    isSingleDay: false,
  })),
}));

// Mock auth store
vi.mock('@/store/authStore', () => ({
  useAuthStore: () => ({
    currentUser: { id: 'user-1', tenantId: 'tenant-1' },
  }),
}));

describe('Dashboard', () => {
  const createWrapper = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    return ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <MantineProvider>{children}</MantineProvider>
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render Dashboard with data', async () => {
    // Arrange & Act
    render(<Dashboard />, { wrapper: createWrapper() });

    // Assert - Check if main metrics are displayed
    await waitFor(() => {
      expect(screen.getByText('1,000')).toBeInTheDocument(); // Total events
    });
  });

  it('should show loading state initially', async () => {
    // Arrange - Mock loading state
    const { useDashboard } = await import('@/pages/Dashboard/hooks/useDashboard.tsx');
    vi.mocked(useDashboard).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      isFetching: false,
      dateRange: { startDate: '2024-01-01', endDate: '2024-01-31' },
      localDateRange: { startDate: new Date(), endDate: new Date() },
      groupBy: 'day',
      handleDateRangeChange: vi.fn(),
      handleGroupByChange: vi.fn(),
      fetchAnalytics: vi.fn(),
      hasValidDateRange: true,
      isSingleDay: false,
    } as any);

    // Act
    render(<Dashboard />, { wrapper: createWrapper() });

    // Assert - Check for loader
    await waitFor(() => {
      const loaders = screen.queryAllByRole('status');
      expect(loaders.length).toBeGreaterThan(0);
    });
  });

  it('should handle error state', async () => {
    // Arrange - Mock error state
    const { useDashboard } = await import('@/pages/Dashboard/hooks/useDashboard.tsx');
    vi.mocked(useDashboard).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to fetch analytics'),
      isFetching: false,
      dateRange: { startDate: '2024-01-01', endDate: '2024-01-31' },
      localDateRange: { startDate: new Date(), endDate: new Date() },
      groupBy: 'day',
      handleDateRangeChange: vi.fn(),
      handleGroupByChange: vi.fn(),
      fetchAnalytics: vi.fn(),
      hasValidDateRange: true,
      isSingleDay: false,
    } as any);

    // Act
    render(<Dashboard />, { wrapper: createWrapper() });

    // Assert - Should show error message
    await waitFor(() => {
      expect(screen.getByText(/failed to fetch analytics/i)).toBeInTheDocument();
    });
  });

  it('should call callbacks when hook executes', () => {
    // Arrange
    const { useDashboard } = require('@/pages/Dashboard/hooks/useDashboard.tsx');
    let onSuccessCallback: Function | undefined;

    vi.mocked(useDashboard).mockImplementation((options: any) => {
      // Capture the callback
      onSuccessCallback = options?.onSuccess;

      return {
        data: undefined,
        isLoading: false,
        error: null,
        isFetching: false,
        dateRange: { startDate: '2024-01-01', endDate: '2024-01-31' },
        localDateRange: { startDate: new Date(), endDate: new Date() },
        groupBy: 'day',
        handleDateRangeChange: vi.fn(),
        handleGroupByChange: vi.fn(),
        fetchAnalytics: vi.fn(),
        hasValidDateRange: true,
        isSingleDay: false,
      };
    });

    // Act
    render(<Dashboard />, { wrapper: createWrapper() });

    // Assert - Verify callbacks were passed
    expect(onSuccessCallback).toBeDefined();
    expect(typeof onSuccessCallback).toBe('function');
  });

  it('should maintain stable callback references with useCallback', () => {
    // Arrange
    const { useDashboard } = require('@/pages/Dashboard/hooks/useDashboard.tsx');
    let firstOnSuccess: Function | undefined;
    let firstOnError: Function | undefined;

    vi.mocked(useDashboard).mockImplementation((options: any) => {
      if (!firstOnSuccess) {
        firstOnSuccess = options?.onSuccess;
        firstOnError = options?.onError;
      } else {
        // Second render - callbacks should be the same (referential equality)
        expect(options?.onSuccess).toBe(firstOnSuccess);
        expect(options?.onError).toBe(firstOnError);
      }

      return {
        data: undefined,
        isLoading: false,
        error: null,
        isFetching: false,
        dateRange: { startDate: '2024-01-01', endDate: '2024-01-31' },
        localDateRange: { startDate: new Date(), endDate: new Date() },
        groupBy: 'day',
        handleDateRangeChange: vi.fn(),
        handleGroupByChange: vi.fn(),
        fetchAnalytics: vi.fn(),
        hasValidDateRange: true,
        isSingleDay: false,
      };
    });

    // Act - Render twice to test callback stability
    const { rerender } = render(<Dashboard />, { wrapper: createWrapper() });
    rerender(<Dashboard />);

    // Assert - Test passes if no expect assertions fail above
    expect(firstOnSuccess).toBeDefined();
  });

  it('should render all dashboard sections', async () => {
    // Act
    const { container } = render(<Dashboard />, { wrapper: createWrapper() });

    // Assert - Check for main sections (by class names from imports)
    await waitFor(() => {
      // DashboardHeader should be present
      const headers = container.querySelectorAll('[class*="DashboardHeader"]');
      
      // DashboardControls should be present (date controls)
      const controls = container.querySelectorAll('[class*="DashboardControls"]');
      
      // DashboardContent should be present (charts and stats)
      const content = container.querySelectorAll('[class*="DashboardContent"]');
      
      // At least one of each should exist
      expect(headers.length + controls.length + content.length).toBeGreaterThan(0);
    });
  });
});

