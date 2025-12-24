import { Badge } from '@mantine/core';
import { IconRefresh } from '@tabler/icons-react';
import classes from './UpdatingIndicator.module.scss';

interface UpdatingIndicatorProps {
  isFetching: boolean;
  isLoading: boolean;
  label?: string;
  color?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const UpdatingIndicator = ({
  isFetching,
  isLoading,
  label = 'Updating...',
  color = 'blue',
  size = 'lg',
}: UpdatingIndicatorProps) => {
  if (!isFetching || isLoading) {
    return null;
  }

  return (
    <Badge
      size={size}
      color={color}
      variant="light"
      leftSection={<IconRefresh size={14} className={classes.refreshIcon} />}
    >
      {label}
    </Badge>
  );
};

