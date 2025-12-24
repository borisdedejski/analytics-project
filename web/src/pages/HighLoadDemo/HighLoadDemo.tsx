import { useState } from 'react';
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Alert,
  Tabs,
  Grid,
  Paper,
  Loader,
} from '@mantine/core';
import {
  IconRocket,
  IconFlame,
  IconAlertTriangle,
  IconCheck,
  IconX,
  IconRefresh,
} from '@tabler/icons-react';
import { LoadMetrics } from './types';
import { useTrafficSpike } from './hooks/useTrafficSpike';
import { useCircuitBreaker } from './hooks/useCircuitBreaker';
import { useCachePerformance } from './hooks/useCachePerformance';
import { useGracefulDegradation } from './hooks/useGracefulDegradation';
import { useIntegration } from './hooks/useIntegration';
import {
  ScenarioCard,
  ScenarioLogs,
  SystemMetrics,
} from './components';
import classes from './HighLoadDemo.module.scss';

export const HighLoadDemo = () => {
  const [activeTab, setActiveTab] = useState<string | null>('traffic');
  const [systemMetrics, setSystemMetrics] = useState<LoadMetrics | null>(null);

  const trafficSpike = useTrafficSpike();
  const circuitBreaker = useCircuitBreaker();
  const cachePerformance = useCachePerformance();
  const gracefulDegradation = useGracefulDegradation();
  const integration = useIntegration(setSystemMetrics);

  const scenarios = {
    traffic: trafficSpike.scenario,
    circuit: circuitBreaker.scenario,
    cache: cachePerformance.scenario,
    degradation: gracefulDegradation.scenario,
    integration: integration.scenario,
  };

  const runAllScenarios = async () => {
    await trafficSpike.run();
    await new Promise(resolve => setTimeout(resolve, 2000));
    await circuitBreaker.run();
    await new Promise(resolve => setTimeout(resolve, 2000));
    await cachePerformance.run();
    await new Promise(resolve => setTimeout(resolve, 2000));
    await gracefulDegradation.run();
    await new Promise(resolve => setTimeout(resolve, 2000));
    await integration.run();
  };

  const resetAll = () => {
    trafficSpike.reset();
    circuitBreaker.reset();
    cachePerformance.reset();
    gracefulDegradation.reset();
    integration.reset();
    setSystemMetrics(null);
  };

  const isAnyScenarioRunning = Object.values(scenarios).some(s => s.status === 'running');

  return (
    <Container size="xl" className={classes.container}>
      <Stack gap="xl">
        {/* Header */}
        <div>
          <Group justify="space-between" align="flex-start">
            <div>
              <Title order={1}>
                <Group gap="sm">
                  <IconRocket size={36} />
                  High Load Demo
                </Group>
              </Title>
              <Text c="dimmed" mt="sm">
                Test and visualize system behavior under various high-load scenarios
              </Text>
            </div>
            <Group>
              <Button
                leftSection={<IconRefresh size={18} />}
                onClick={resetAll}
                variant="light"
              >
                Reset All
              </Button>
              <Button
                leftSection={<IconFlame size={18} />}
                onClick={runAllScenarios}
                disabled={isAnyScenarioRunning}
              >
                Run All Scenarios
              </Button>
            </Group>
          </Group>
        </div>

        {/* System Metrics */}
        {systemMetrics && <SystemMetrics metrics={systemMetrics} />}

        {/* Scenario Cards */}
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
            <ScenarioCard scenario={trafficSpike.scenario} onRun={trafficSpike.run} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
            <ScenarioCard scenario={circuitBreaker.scenario} onRun={circuitBreaker.run} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
            <ScenarioCard scenario={cachePerformance.scenario} onRun={cachePerformance.run} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
            <ScenarioCard scenario={gracefulDegradation.scenario} onRun={gracefulDegradation.run} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
            <ScenarioCard scenario={integration.scenario} onRun={integration.run} />
          </Grid.Col>
        </Grid>

        {/* Logs Tabs */}
        <Paper shadow="sm" p="md" withBorder>
          <Tabs value={activeTab} onChange={setActiveTab}>
            <Tabs.List>
              {Object.entries(scenarios).map(([key, scenario]) => (
                <Tabs.Tab
                  key={key}
                  value={key}
                  leftSection={
                    scenario.status === 'running' ? <Loader size="xs" /> :
                    scenario.status === 'success' ? <IconCheck size={16} color="green" /> :
                    scenario.status === 'error' ? <IconX size={16} color="red" /> : null
                  }
                >
                  {scenario.name}
                </Tabs.Tab>
              ))}
            </Tabs.List>

            {Object.entries(scenarios).map(([key, scenario]) => (
              <Tabs.Panel key={key} value={key} pt="md">
                <ScenarioLogs scenario={scenario} />
              </Tabs.Panel>
            ))}
          </Tabs>
        </Paper>

        {/* Info Alert */}
        <Alert color="yellow" icon={<IconAlertTriangle size={20} />}>
          <Text size="sm" fw={600} mb="xs">Testing in Production?</Text>
          <Text size="sm">
            These tests will generate significant load on your system. Only run in development or staging environments.
            High load scenarios may trigger rate limiting and circuit breakers as designed.
          </Text>
        </Alert>
      </Stack>
    </Container>
  );
};

