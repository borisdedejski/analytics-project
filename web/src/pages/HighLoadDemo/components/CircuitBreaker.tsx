import { Grid } from '@mantine/core';
import { useCircuitBreaker } from '../hooks/useCircuitBreaker';
import { ScenarioCard } from './ScenarioCard';

export const CircuitBreaker = () => {
  const { scenario, run } = useCircuitBreaker();

  return (
    <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
      <ScenarioCard scenario={scenario} onRun={run} />
    </Grid.Col>
  );
};

