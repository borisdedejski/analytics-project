import { Paper, Text, Group } from '@mantine/core';
import classes from './StatCard.module.scss';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
}

export const StatCard = ({ title, value, icon, color = 'blue' }: StatCardProps) => {
  return (
    <Paper p="md" radius="md" withBorder className={classes.card}>
      <Group justify="space-between">
        <div>
          <Text c="dimmed" className={classes.title}>
            {title}
          </Text>
          <Text className={classes.value}>{value}</Text>
        </div>
        <div style={{ color: `var(--mantine-color-${color}-6)` }}>{icon}</div>
      </Group>
    </Paper>
  );
};

