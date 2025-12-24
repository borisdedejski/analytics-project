import { Button, Card, Group, Text, Badge, Stack, Progress, Loader } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { ScenarioResult } from '../types';

interface ScenarioCardProps {
  scenario: ScenarioResult;
  onRun: () => void;
}

const getStatusColor = (status: ScenarioResult['status']) => {
  switch (status) {
    case 'running': return 'blue';
    case 'success': return 'green';
    case 'error': return 'red';
    default: return 'gray';
  }
};

const getStatusIcon = (status: ScenarioResult['status']) => {
  switch (status) {
    case 'running': return <Loader size="sm" />;
    case 'success': return <IconCheck size={18} />;
    case 'error': return <IconX size={18} />;
    default: return null;
  }
};

export const ScenarioCard = ({ scenario, onRun }: ScenarioCardProps) => {
  return (
    <Card shadow="sm" padding="lg" withBorder>
      <Group justify="space-between" mb="xs">
        <Text fw={600}>{scenario.name}</Text>
        <Badge color={getStatusColor(scenario.status)} leftSection={getStatusIcon(scenario.status)}>
          {scenario.status}
        </Badge>
      </Group>

      {scenario.metrics && (
        <Stack gap="xs" mb="md">
          {scenario.metrics.successful !== undefined && (
            <div>
              <Group justify="space-between" mb={4}>
                <Text size="sm" c="dimmed">Success Rate</Text>
                <Text size="sm" fw={600}>
                  {((scenario.metrics.successful / (scenario.metrics.totalRequests || 1)) * 100).toFixed(1)}%
                </Text>
              </Group>
              <Progress
                value={(scenario.metrics.successful / (scenario.metrics.totalRequests || 1)) * 100}
                color="green"
                size="lg"
              />
            </div>
          )}
          {scenario.metrics.throughput !== undefined && (
            <Text size="sm">
              <strong>Throughput:</strong> {scenario.metrics.throughput.toFixed(1)} req/s
            </Text>
          )}
          {scenario.metrics.hitRate !== undefined && (
            <Text size="sm">
              <strong>Hit Rate:</strong> {scenario.metrics.hitRate.toFixed(2)}%
            </Text>
          )}
        </Stack>
      )}

      <Button
        fullWidth
        onClick={onRun}
        disabled={scenario.status === 'running'}
        variant={scenario.status === 'idle' ? 'filled' : 'light'}
      >
        {scenario.status === 'running' ? 'Running...' : 'Run Test'}
      </Button>
    </Card>
  );
};

