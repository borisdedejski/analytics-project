import { Alert, Group, Text, RingProgress } from '@mantine/core';
import { IconShield } from '@tabler/icons-react';
import { LoadMetrics } from '../types';

interface SystemMetricsProps {
  metrics: LoadMetrics;
}

export const SystemMetrics = ({ metrics }: SystemMetricsProps) => {
  return (
    <Alert color="blue" icon={<IconShield size={20} />}>
      <Group justify="space-between">
        <div>
          <Text fw={600}>System Load: {metrics.level}</Text>
          <Text size="sm" c="dimmed">
            {metrics.requestsPerSecond.toFixed(1)} req/s • Error rate: {metrics.errorRate.toFixed(2)}%
          </Text>
        </div>
        <RingProgress
          size={80}
          thickness={8}
          sections={[
            { value: metrics.currentLoad, color: metrics.currentLoad > 80 ? 'red' : 'blue' },
          ]}
          label={
            <Text size="xs" ta="center" fw={700}>
              {metrics.currentLoad.toFixed(0)}%
            </Text>
          }
        />
      </Group>
    </Alert>
  );
};

