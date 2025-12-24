import { Grid } from '@mantine/core';
import { useIntegration } from '../hooks/useIntegration';
import { ScenarioCard } from './ScenarioCard';
import { LoadMetrics } from '../types';

interface IntegrationProps {
  onMetricsUpdate?: (metrics: LoadMetrics) => void;
}

export const Integration = ({ onMetricsUpdate }: IntegrationProps) => {
  const { scenario, run } = useIntegration(onMetricsUpdate);

  return (
    <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
      <ScenarioCard scenario={scenario} onRun={run} />
    </Grid.Col>
  );
};

