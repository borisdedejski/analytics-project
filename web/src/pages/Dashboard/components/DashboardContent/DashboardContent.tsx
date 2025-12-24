import { Loader, Alert } from '@mantine/core';
import { IconActivity, IconUsers, IconChartLine, IconAlertCircle } from '@tabler/icons-react';
import { StatCard } from '@/features/analytics/components/StatCard/StatCard';
import { EventsChart } from '@/features/analytics/components/EventsChart/EventsChart';
import { EventTypesPie } from '@/features/analytics/components/EventTypesPie/EventTypesPie';
import { TopPagesTable } from '@/features/analytics/components/TopPagesTable/TopPagesTable';
import { DeviceStats } from '@/features/analytics/components/DeviceStats/DeviceStats';
import { AnalyticsSummary } from '@/types/analytics';
import classes from './DashboardContent.module.scss';

interface DashboardContentProps {
  hasValidDateRange: boolean;
  data: AnalyticsSummary | undefined;
}

export const DashboardContent = ({ hasValidDateRange, data }: DashboardContentProps) => {
  if (!hasValidDateRange) {
    return (
      <Alert icon={<IconAlertCircle />} title="Select Date Range" color="blue" className={classes.alert}>
        Please select both start and end dates to view analytics data.
      </Alert>
    );
  }

  if (!data) {
    return (
      <div className={classes.loading}>
        <Loader size="xl" />
      </div>
    );
  }

  return (
    <>
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
    </>
  );
};

