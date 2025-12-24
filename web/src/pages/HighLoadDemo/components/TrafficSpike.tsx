import { Grid } from '@mantine/core';
import { useTrafficSpike } from '../hooks/useTrafficSpike';
import { ScenarioCard } from './ScenarioCard';

export const TrafficSpike = () => {
  const { scenario, run } = useTrafficSpike();

  return (
    <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
      <ScenarioCard scenario={scenario} onRun={run} />
    </Grid.Col>
  );
};

