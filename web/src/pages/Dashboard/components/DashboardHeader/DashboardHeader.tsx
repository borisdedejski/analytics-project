import { Group, Title, Text, Badge } from '@mantine/core';
import { IconCalendar } from '@tabler/icons-react';
import { format } from 'date-fns';
import { UpdatingIndicator } from '@/shared/components/UpdatingIndicator/UpdatingIndicator';
import classes from './DashboardHeader.module.scss';

interface DashboardHeaderProps {
  isSingleDay: boolean;
  dateStart: Date | null;
  isFetching: boolean;
  isLoading: boolean;
}

export const DashboardHeader = ({
  isSingleDay,
  dateStart,
  isFetching,
  isLoading,
}: DashboardHeaderProps) => {
  return (
    <div className={classes.header}>
      <Group justify="space-between" align="center">
        <div>
          <Group gap="sm" align="center">
            <Title className={classes.title}>Analytics Dashboard</Title>
            {isSingleDay && dateStart && (
              <Badge
                size="lg"
                color="grape"
                variant="light"
                leftSection={<IconCalendar size={14} />}
              >
                {format(dateStart, 'MMM dd, yyyy')}
              </Badge>
            )}
          </Group>
          <Text className={classes.subtitle}>Real-time insights and metrics</Text>
        </div>
        <UpdatingIndicator isFetching={isFetching} isLoading={isLoading} />
      </Group>
    </div>
  );
};

