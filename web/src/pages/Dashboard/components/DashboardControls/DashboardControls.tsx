import { Group, Select, Text, ActionIcon, Tooltip } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconRefresh } from '@tabler/icons-react';
import classes from './DashboardControls.module.scss';

interface DashboardControlsProps {
  localDateRange: [Date | null, Date | null];
  groupBy: string;
  isFetching: boolean;
  onDateRangeChange: (dates: [Date | null, Date | null] | null) => void;
  onGroupByChange: (value: string | null) => void;
  onRefresh: () => void;
}

const GROUP_BY_OPTIONS = [
  { value: 'hour', label: 'Hour' },
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];

export const DashboardControls = ({
  localDateRange,
  groupBy,
  isFetching,
  onDateRangeChange,
  onGroupByChange,
  onRefresh,
}: DashboardControlsProps) => {
  return (
    <div className={classes.controls}>
      <Group gap="md" wrap="wrap" className={classes.controlsGroup}>
        <DatePickerInput
          type="range"
          label="Date Range"
          placeholder="Pick date range (same date = single day)"
          value={localDateRange}
          onChange={onDateRangeChange}
          clearable
          maxDate={new Date()}
          allowSingleDateInRange
          className={classes.dateInput}
        />
        <Select
          label="Group By"
          value={groupBy}
          onChange={onGroupByChange}
          data={GROUP_BY_OPTIONS}
          className={classes.groupBySelect}
        />
        <div className={classes.refreshButton}>
          <Text size="xs" c="dimmed" mb={4}>Actions</Text>
          <Tooltip label="Refresh dashboard">
            <ActionIcon
              size="lg"
              variant="light"
              color="blue"
              onClick={onRefresh}
              loading={isFetching}
            >
              <IconRefresh size={18} />
            </ActionIcon>
          </Tooltip>
        </div>
      </Group>
    </div>
  );
};

