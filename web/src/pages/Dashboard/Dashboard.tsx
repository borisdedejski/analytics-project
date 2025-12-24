import { useCallback } from 'react';
import { Container } from '@mantine/core';
import { Notifications, notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { DataStateHandler } from '@/shared/components/DataStateHandler/DataStateHandler';
import { DashboardHeader } from './components/DashboardHeader/DashboardHeader';
import { DashboardControls } from './components/DashboardControls/DashboardControls';
import { DashboardContent } from './components/DashboardContent/DashboardContent';
import { useDashboard } from './hooks/useDashboard.tsx';
import classes from './Dashboard.module.scss';

export const Dashboard = () => {
  const {
    data,
    isLoading,
    error,
    isFetching,
    
    dateRange,
    localDateRange,
    groupBy,
    
    handleDateRangeChange,
    handleGroupByChange,
    fetchAnalytics,
    
    hasValidDateRange,
    isSingleDay,
  } = useDashboard({
    onSuccess: useCallback(() => {
      notifications.show({
        title: 'Success',
        message: 'Analytics data refreshed successfully',
        color: 'green',
        icon: <IconCheck size={18} />,
        autoClose: 3000,
      });
    }, []),
    onError: useCallback((error: Error) => {
      notifications.show({
        title: 'Analytics Failed',
        message: error.message || 'Failed to load analytics data. Please try again.',
        color: 'red',
        icon: <IconX size={18} />,
        autoClose: 7000,
      });
    }, []),
  });

  return (
    <>
      <Notifications position="top-right" zIndex={1000} />
      <DataStateHandler isLoading={isLoading} error={error as Error | null}>
        <Container className={classes.container} size="xl">
          <DashboardHeader
            isSingleDay={isSingleDay}
            dateStart={dateRange.startDate}
            isFetching={isFetching}
            isLoading={isLoading}
          />

          <DashboardControls
            localDateRange={localDateRange}
            groupBy={groupBy}
            isFetching={isFetching}
            onDateRangeChange={handleDateRangeChange}
            onGroupByChange={handleGroupByChange}
            onRefresh={fetchAnalytics}
          />

          <DashboardContent
            hasValidDateRange={hasValidDateRange}
            data={data}
          />
        </Container>
      </DataStateHandler>
    </>
  );
};

