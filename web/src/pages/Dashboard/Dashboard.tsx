import { Container, Title, Text, Loader, Alert, Select, Group } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconActivity, IconUsers, IconChartLine, IconAlertCircle } from '@tabler/icons-react';
import { useAnalytics } from '@/features/analytics/hooks/useAnalytics';
import { useAnalyticsStore } from '@/store/analyticsStore';
import { StatCard } from '@/features/analytics/components/StatCard/StatCard';
import { EventsChart } from '@/features/analytics/components/EventsChart/EventsChart';
import { EventTypesPie } from '@/features/analytics/components/EventTypesPie/EventTypesPie';
import { TopPagesTable } from '@/features/analytics/components/TopPagesTable/TopPagesTable';
import { DeviceStats } from '@/features/analytics/components/DeviceStats/DeviceStats';
import classes from './Dashboard.module.scss';

export const Dashboard = () => {
  const { data, isLoading, error } = useAnalytics();
  const { dateRange, groupBy, setDateRange, setGroupBy } = useAnalyticsStore();

  if (isLoading) {
    return (
      <div className={classes.loading}>
        <Loader size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <Container className={classes.container}>
        <Alert icon={<IconAlertCircle />} title="Error" color="red" className={classes.error}>
          Failed to load analytics data. Please try again later.
        </Alert>
      </Container>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <Container className={classes.container} size="xl">
      <div className={classes.header}>
        <Title className={classes.title}>Analytics Dashboard</Title>
        <Text className={classes.subtitle}>Real-time insights and metrics</Text>
      </div>

      <div className={classes.controls}>
        <DatePickerInput
          type="range"
          label="Date Range"
          placeholder="Pick dates range"
          value={[dateRange.startDate, dateRange.endDate]}
          onChange={(value) => {
            if (value[0] && value[1]) {
              setDateRange({ startDate: value[0], endDate: value[1] });
            }
          }}
        />
        <Select
          label="Group By"
          value={groupBy}
          onChange={(value) => setGroupBy(value as any)}
          data={[
            { value: 'hour', label: 'Hour' },
            { value: 'day', label: 'Day' },
            { value: 'week', label: 'Week' },
            { value: 'month', label: 'Month' },
          ]}
        />
      </div>

      <div className={classes.stats}>
        <StatCard
          title="Total Events"
          value={data.totalEvents.toLocaleString()}
          icon={<IconActivity size={32} />}
          color="blue"
        />
        <StatCard
          title="Unique Users"
          value={data.uniqueUsers.toLocaleString()}
          icon={<IconUsers size={32} />}
          color="cyan"
        />
        <StatCard
          title="Event Types"
          value={data.eventsByType.length}
          icon={<IconChartLine size={32} />}
          color="violet"
        />
      </div>

      <div className={classes.charts}>
        <EventsChart data={data.timeSeriesData} />
        <EventTypesPie data={data.eventsByType} />
      </div>

      <div className={classes.tables}>
        <TopPagesTable data={data.topPages} />
        <DeviceStats data={data.deviceStats} />
      </div>
    </Container>
  );
};

