import { useState, useCallback, useRef, useEffect } from 'react';
import {
  Container,
  Title,
  Text,
  Button,
  Card,
  Group,
  Stack,
  Badge,
  Progress,
  Alert,
  Tabs,
  ScrollArea,
  Grid,
  Paper,
  RingProgress,
  Loader,
} from '@mantine/core';
import {
  IconRocket,
  IconFlame,
  IconShield,
  IconDatabase,
  IconAlertTriangle,
  IconCheck,
  IconX,
  IconRefresh,
} from '@tabler/icons-react';
import classes from './HighLoadDemo.module.scss';

interface ScenarioResult {
  name: string;
  status: 'idle' | 'running' | 'success' | 'error';
  metrics?: {
    totalRequests?: number;
    successful?: number;
    rateLimited?: number;
    errors?: number;
    duration?: number;
    throughput?: number;
    hitRate?: number;
    loadLevel?: string;
  };
  logs: string[];
}

interface LoadMetrics {
  level: string;
  requestsPerSecond: number;
  errorRate: number;
  currentLoad: number;
}

export const HighLoadDemo = () => {
  const [activeTab, setActiveTab] = useState<string | null>('traffic');
  const [scenarios, setScenarios] = useState<Record<string, ScenarioResult>>({
    traffic: { name: 'Traffic Spike', status: 'idle', logs: [] },
    circuit: { name: 'Circuit Breaker', status: 'idle', logs: [] },
    cache: { name: 'Cache Performance', status: 'idle', logs: [] },
    degradation: { name: 'Graceful Degradation', status: 'idle', logs: [] },
    integration: { name: 'E2E Integration', status: 'idle', logs: [] },
  });
  const [systemMetrics, setSystemMetrics] = useState<LoadMetrics | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  const DEFAULT_TENANT_ID = 'default-tenant';

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [scenarios]);

  const addLog = useCallback((scenario: string, message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
    const emoji = {
      info: '📋',
      success: '✅',
      error: '❌',
      warning: '⚠️',
    }[type];

    setScenarios(prev => ({
      ...prev,
      [scenario]: {
        ...prev[scenario],
        logs: [...prev[scenario].logs, `${emoji} ${message}`],
      },
    }));
  }, []);

  const updateScenario = useCallback((
    scenario: string,
    updates: Partial<ScenarioResult>
  ) => {
    setScenarios(prev => ({
      ...prev,
      [scenario]: { ...prev[scenario], ...updates },
    }));
  }, []);

  // Scenario 1: Traffic Spike
  const runTrafficSpike = async () => {
    updateScenario('traffic', { status: 'running', logs: [] });
    addLog('traffic', 'Starting traffic spike simulation (1000 requests)...', 'info');

    try {
      const requests = Array(1000).fill(null).map((_, i) =>
        fetch(`${API_URL}/analytics/summary?startDate=2024-01-01&endDate=2024-12-31&groupBy=day`, {
          headers: { 'x-tenant-id': DEFAULT_TENANT_ID }
        })
          .then(res => ({ status: res.status, success: res.ok }))
          .catch(() => ({ status: 0, success: false }))
      );

      const startTime = Date.now();
      const results = await Promise.all(requests);
      const duration = Date.now() - startTime;

      const successful = results.filter(r => r.success).length;
      const rateLimited = results.filter(r => r.status === 429).length;
      const errors = results.filter(r => !r.success && r.status !== 429).length;

      addLog('traffic', `Completed 1000 requests in ${duration}ms`, 'success');
      addLog('traffic', `Successful: ${successful} (${(successful / 1000 * 100).toFixed(1)}%)`, 'success');
      addLog('traffic', `Rate limited: ${rateLimited} (${(rateLimited / 1000 * 100).toFixed(1)}%)`, 'warning');
      addLog('traffic', `Errors: ${errors} (${(errors / 1000 * 100).toFixed(1)}%)`, errors > 0 ? 'error' : 'success');
      addLog('traffic', `Throughput: ${(1000 / (duration / 1000)).toFixed(1)} req/s`, 'info');

      updateScenario('traffic', {
        status: 'success',
        metrics: {
          totalRequests: 1000,
          successful,
          rateLimited,
          errors,
          duration,
          throughput: 1000 / (duration / 1000),
        },
      });

      if (rateLimited > 0) {
        addLog('traffic', 'Rate limiting working as expected!', 'success');
      }
    } catch (error) {
      addLog('traffic', `Error: ${(error as Error).message}`, 'error');
      updateScenario('traffic', { status: 'error' });
    }
  };

  // Scenario 2: Circuit Breaker Test
  const runCircuitBreaker = async () => {
    updateScenario('circuit', { status: 'running', logs: [] });
    addLog('circuit', 'Testing circuit breaker with simulated failures...', 'info');

    try {
      // Simulate multiple requests that might trigger circuit breaker
      for (let i = 0; i < 10; i++) {
        addLog('circuit', `Attempt ${i + 1}: Making request...`, 'info');
        
        try {
          const response = await fetch(`${API_URL}/analytics/summary?startDate=2024-01-01&endDate=2024-12-31&groupBy=day`, {
            headers: { 'x-tenant-id': DEFAULT_TENANT_ID }
          });
          if (response.ok) {
            addLog('circuit', `Attempt ${i + 1}: Success`, 'success');
          } else if (response.status === 503) {
            addLog('circuit', `Attempt ${i + 1}: Circuit OPEN (503)`, 'warning');
          } else {
            addLog('circuit', `Attempt ${i + 1}: Failed (${response.status})`, 'error');
          }
        } catch (err) {
          addLog('circuit', `Attempt ${i + 1}: Error`, 'error');
        }

        await new Promise(resolve => setTimeout(resolve, 500));
      }

      updateScenario('circuit', { status: 'success' });
      addLog('circuit', 'Circuit breaker test completed!', 'success');
    } catch (error) {
      addLog('circuit', `Error: ${(error as Error).message}`, 'error');
      updateScenario('circuit', { status: 'error' });
    }
  };

  // Scenario 3: Cache Performance
  const runCachePerformance = async () => {
    updateScenario('cache', { status: 'running', logs: [] });
    addLog('cache', 'Testing cache performance...', 'info');

    try {
      // First request (cache miss)
      addLog('cache', 'Test 1: Cache Miss (first request)', 'info');
      const miss1Start = Date.now();
      await fetch(`${API_URL}/analytics/summary?startDate=2024-01-01&endDate=2024-12-31&groupBy=day`, {
        headers: { 'x-tenant-id': DEFAULT_TENANT_ID }
      });
      const miss1Duration = Date.now() - miss1Start;
      addLog('cache', `Duration: ${miss1Duration}ms`, 'info');

      // Second request (cache hit)
      addLog('cache', 'Test 2: Cache Hit (repeated request)', 'info');
      const hit1Start = Date.now();
      await fetch(`${API_URL}/analytics/summary?startDate=2024-01-01&endDate=2024-12-31&groupBy=day`, {
        headers: { 'x-tenant-id': DEFAULT_TENANT_ID }
      });
      const hit1Duration = Date.now() - hit1Start;
      addLog('cache', `Duration: ${hit1Duration}ms`, 'info');

      const speedup = ((miss1Duration - hit1Duration) / miss1Duration * 100).toFixed(1);
      addLog('cache', `Cache speedup: ${speedup}% faster`, 'success');

      // Get cache stats
      const statsResponse = await fetch(`${API_URL}/analytics/cache/stats`);
      if (statsResponse.ok) {
        const stats = await statsResponse.json();
        addLog('cache', `Cache hit rate: ${stats.cache?.hitRate?.toFixed(2)}%`, 'success');
        
        updateScenario('cache', {
          status: 'success',
          metrics: { hitRate: stats.cache?.hitRate },
        });
      }

      addLog('cache', 'Cache performance test completed!', 'success');
    } catch (error) {
      addLog('cache', `Error: ${(error as Error).message}`, 'error');
      updateScenario('cache', { status: 'error' });
    }
  };

  // Scenario 4: Graceful Degradation
  const runGracefulDegradation = async () => {
    updateScenario('degradation', { status: 'running', logs: [] });
    addLog('degradation', 'Testing graceful degradation under load...', 'info');

    try {
      // Simulate load with different priorities
      const priorities = [1, 3, 5, 7, 9];
      
      for (const priority of priorities) {
        addLog('degradation', `Testing priority ${priority} request...`, 'info');
        
        const response = await fetch(
          `${API_URL}/analytics/summary?startDate=2024-01-01&endDate=2024-12-31&groupBy=day`,
          { 
            headers: { 
              'X-Priority': String(priority),
              'x-tenant-id': DEFAULT_TENANT_ID
            } 
          }
        );

        if (response.ok) {
          addLog('degradation', `Priority ${priority}: Accepted ✓`, 'success');
        } else if (response.status === 503) {
          addLog('degradation', `Priority ${priority}: Rejected (degraded)`, 'warning');
        }
      }

      updateScenario('degradation', { status: 'success' });
      addLog('degradation', 'Graceful degradation test completed!', 'success');
    } catch (error) {
      addLog('degradation', `Error: ${(error as Error).message}`, 'error');
      updateScenario('degradation', { status: 'error' });
    }
  };

  // Scenario 5: End-to-End Integration
  const runIntegration = async () => {
    updateScenario('integration', { status: 'running', logs: [] });
    addLog('integration', 'Running end-to-end integration test...', 'info');

    try {
      // Test 1: Normal request
      addLog('integration', 'Test 1: Normal priority request', 'info');
      const response1 = await fetch(`${API_URL}/analytics/summary?startDate=2024-01-01&endDate=2024-12-31&groupBy=day`, {
        headers: { 'x-tenant-id': DEFAULT_TENANT_ID }
      });
      addLog('integration', `Status: ${response1.status}`, response1.ok ? 'success' : 'error');

      if (response1.ok) {
        const data = await response1.json();
        addLog('integration', `Has data: ${!!data.totalEvents}`, 'success');
      }

      // Test 2: Cache stats
      addLog('integration', 'Test 2: Fetching cache statistics', 'info');
      const statsResponse = await fetch(`${API_URL}/analytics/cache/stats`);
      if (statsResponse.ok) {
        const stats = await statsResponse.json();
        addLog('integration', `Cache hit rate: ${stats.cache?.hitRate?.toFixed(2)}%`, 'success');
        addLog('integration', `Load level: ${stats.load?.level}`, 'info');
        
        setSystemMetrics({
          level: stats.load?.level || 'NORMAL',
          requestsPerSecond: stats.load?.requestsPerSecond || 0,
          errorRate: stats.load?.errorRate || 0,
          currentLoad: stats.load?.currentLoad || 0,
        });
      }

      // Test 3: Health check
      addLog('integration', 'Test 3: Health check', 'info');
      const healthResponse = await fetch(`${API_URL}/analytics/health`);
      if (healthResponse.ok) {
        const health = await healthResponse.json();
        addLog('integration', `System status: ${health.status}`, 'success');
      }

      updateScenario('integration', { status: 'success' });
      addLog('integration', 'End-to-end integration test completed!', 'success');
    } catch (error) {
      addLog('integration', `Error: ${(error as Error).message}`, 'error');
      updateScenario('integration', { status: 'error' });
    }
  };

  const runAllScenarios = async () => {
    await runTrafficSpike();
    await new Promise(resolve => setTimeout(resolve, 2000));
    await runCircuitBreaker();
    await new Promise(resolve => setTimeout(resolve, 2000));
    await runCachePerformance();
    await new Promise(resolve => setTimeout(resolve, 2000));
    await runGracefulDegradation();
    await new Promise(resolve => setTimeout(resolve, 2000));
    await runIntegration();
  };

  const resetAll = () => {
    setScenarios({
      traffic: { name: 'Traffic Spike', status: 'idle', logs: [] },
      circuit: { name: 'Circuit Breaker', status: 'idle', logs: [] },
      cache: { name: 'Cache Performance', status: 'idle', logs: [] },
      degradation: { name: 'Graceful Degradation', status: 'idle', logs: [] },
      integration: { name: 'E2E Integration', status: 'idle', logs: [] },
    });
    setSystemMetrics(null);
  };

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
                disabled={Object.values(scenarios).some(s => s.status === 'running')}
              >
                Run All Scenarios
              </Button>
            </Group>
          </Group>
        </div>

        {/* System Metrics */}
        {systemMetrics && (
          <Alert color="blue" icon={<IconShield size={20} />}>
            <Group justify="space-between">
              <div>
                <Text fw={600}>System Load: {systemMetrics.level}</Text>
                <Text size="sm" c="dimmed">
                  {systemMetrics.requestsPerSecond.toFixed(1)} req/s • Error rate: {systemMetrics.errorRate.toFixed(2)}%
                </Text>
              </div>
              <RingProgress
                size={80}
                thickness={8}
                sections={[
                  { value: systemMetrics.currentLoad, color: systemMetrics.currentLoad > 80 ? 'red' : 'blue' },
                ]}
                label={
                  <Text size="xs" ta="center" fw={700}>
                    {systemMetrics.currentLoad.toFixed(0)}%
                  </Text>
                }
              />
            </Group>
          </Alert>
        )}

        {/* Scenario Cards */}
        <Grid>
          {Object.entries(scenarios).map(([key, scenario]) => (
            <Grid.Col key={key} span={{ base: 12, sm: 6, lg: 4 }}>
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
                        <Text size="sm" c="dimmed">Success Rate</Text>
                        <Progress
                          value={(scenario.metrics.successful / (scenario.metrics.totalRequests || 1)) * 100}
                          color="green"
                          size="lg"
                          label={`${((scenario.metrics.successful / (scenario.metrics.totalRequests || 1)) * 100).toFixed(1)}%`}
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
                  onClick={() => {
                    switch (key) {
                      case 'traffic': runTrafficSpike(); break;
                      case 'circuit': runCircuitBreaker(); break;
                      case 'cache': runCachePerformance(); break;
                      case 'degradation': runGracefulDegradation(); break;
                      case 'integration': runIntegration(); break;
                    }
                  }}
                  disabled={scenario.status === 'running'}
                  variant={scenario.status === 'idle' ? 'filled' : 'light'}
                >
                  {scenario.status === 'running' ? 'Running...' : 'Run Test'}
                </Button>
              </Card>
            </Grid.Col>
          ))}
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
                <ScrollArea h={400} className={classes.logs}>
                  {scenario.logs.length === 0 ? (
                    <Text c="dimmed" ta="center" py="xl">
                      No logs yet. Run the test to see results.
                    </Text>
                  ) : (
                    <Stack gap="xs">
                      {scenario.logs.map((log, i) => (
                        <Text key={i} size="sm" ff="monospace" className={classes.logEntry}>
                          {log}
                        </Text>
                      ))}
                      <div ref={logsEndRef} />
                    </Stack>
                  )}
                </ScrollArea>
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

