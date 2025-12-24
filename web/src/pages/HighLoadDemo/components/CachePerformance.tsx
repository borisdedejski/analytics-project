import { Grid } from '@mantine/core';
import { useCachePerformance } from '../hooks/useCachePerformance';
import { ScenarioCard } from './ScenarioCard';

export const CachePerformance = () => {
  const { scenario, run } = useCachePerformance();

  return (
    <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
      <ScenarioCard scenario={scenario} onRun={run} />
    </Grid.Col>
  );
};

