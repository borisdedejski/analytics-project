import { Grid } from '@mantine/core';
import { useGracefulDegradation } from '../hooks/useGracefulDegradation';
import { ScenarioCard } from './ScenarioCard';

export const GracefulDegradation = () => {
  const { scenario, run } = useGracefulDegradation();

  return (
    <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
      <ScenarioCard scenario={scenario} onRun={run} />
    </Grid.Col>
  );
};

