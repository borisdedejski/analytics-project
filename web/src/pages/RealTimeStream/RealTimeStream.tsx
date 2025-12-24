import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Container,
  Title,
  Text,
  Paper,
  Group,
  Stack,
  Badge,
  Alert,
  Select,
  Button,
  Progress,
  Card,
  Grid,
  RingProgress,
  Center,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import {
  IconBolt,
  IconAlertCircle,
  IconPlugConnected,
  IconPlugConnectedX,
  IconRefresh,
  IconActivity,
  IconUsers,
  IconClick,
} from '@tabler/icons-react';
import { format, subDays } from 'date-fns';
import { useAuthStore } from '@/store/authStore';
import { analyticsApi } from '@/shared/api/analytics';
import type { AnalyticsSummaryDto } from '@/types/generated/analytics.dto.zod';
import classes from './RealTimeStream.module.scss';

export const RealTimeStream = () => {
  const { currentUser } = useAuthStore();
  const [data, setData] = useState<AnalyticsSummaryDto | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updateCount, setUpdateCount] = useState(0);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 1));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [groupBy, setGroupBy] = useState<'hour' | 'day' | 'week' | 'month'>('hour');
  
  const closeConnectionRef = useRef<(() => void) | null>(null);

  const disconnectStream = useCallback(() => {
    if (closeConnectionRef.current) {
      closeConnectionRef.current();
      closeConnectionRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const connectStream = useCallback(() => {
    // Close existing connection if any
    if (closeConnectionRef.current) {
      closeConnectionRef.current();
    }

    // Don't connect if user is not available
    if (!currentUser?.tenantId) {
      return;
    }

    setError(null);
    setUpdateCount(0);

    try {
      const closeConnection = analyticsApi.createStreamConnection(
        {
          tenantId: currentUser.tenantId,
          startDate: format(startDate, 'yyyy-MM-dd'),
          endDate: format(endDate, 'yyyy-MM-dd'),
          groupBy,
        },
        (newData) => {
          setData(newData);
          setIsConnected(true);
          setUpdateCount((prev) => prev + 1);
          setLastUpdateTime(new Date());
          console.log('📊 Received stream update:', {
            totalEvents: newData.totalEvents,
            uniqueUsers: newData.uniqueUsers,
          });
        },
        (err) => {
          setError(err.message);
          setIsConnected(false);
        }
      );

      closeConnectionRef.current = closeConnection;
      setIsConnected(true);
    } catch (err) {
      console.error('Error connecting to stream:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect to stream');
      setIsConnected(false);
    }
  }, [currentUser, startDate, endDate, groupBy]);

  useEffect(() => {
    // Don't connect if user is not loaded yet
    if (!currentUser?.tenantId) {
      return;
    }

    connectStream();

    return () => {
      disconnectStream();
    };
  }, [currentUser?.tenantId, connectStream, disconnectStream]);

  const calculatePercentage = (value: number | undefined, total: number | undefined) => {
    if (!value || !total || total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  return (
    <Container className={classes.container} size="xl">
      <div className={classes.header}>
        <Group justify="space-between" align="center">
          <div>
            <Title className={classes.title}>
              <IconBolt size={36} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
              Real-Time Analytics Stream
            </Title>
            <Text className={classes.subtitle}>
              Live analytics updates using Server-Sent Events (SSE)
            </Text>
          </div>
          <Group>
            <Badge
              size="lg"
              color={isConnected ? 'green' : 'red'}
              leftSection={isConnected ? <IconPlugConnected size={16} /> : <IconPlugConnectedX size={16} />}
            >
              {isConnected ? 'Connected' : 'Disconnected'}
            </Badge>
            <Button
              leftSection={<IconRefresh size={18} />}
              onClick={() => {
                disconnectStream();
                setTimeout(connectStream, 100);
              }}
              variant="light"
              disabled={!isConnected}
            >
              Reconnect
            </Button>
          </Group>
        </Group>
      </div>

      {/* Connection Info */}
      <Alert
        icon={<IconActivity />}
        title="Stream Information"
        color={isConnected ? 'blue' : 'gray'}
        className={classes.infoAlert}
      >
        <Stack gap="xs">
          <Text size="sm">
            <strong>Updates received:</strong> {updateCount}
          </Text>
          {lastUpdateTime && (
            <Text size="sm">
              <strong>Last update:</strong> {format(lastUpdateTime, 'HH:mm:ss')}
            </Text>
          )}
          <Text size="sm">
            <strong>Update interval:</strong> ~5 seconds
          </Text>
        </Stack>
      </Alert>

      {/* Filters */}
      <Paper className={classes.filtersCard} shadow="sm" p="lg" radius="md" withBorder>
        <Stack gap="md">
          <Group grow>
            <DateInput
              label="Start Date"
              value={startDate}
              onChange={(date) => date && setStartDate(date)}
              maxDate={endDate}
            />
            <DateInput
              label="End Date"
              value={endDate}
              onChange={(date) => date && setEndDate(date)}
              minDate={startDate}
              maxDate={new Date()}
            />
          </Group>
          <Select
            label="Group By"
            value={groupBy}
            onChange={(value) => setGroupBy(value as 'hour' | 'day' | 'week' | 'month')}
            data={[
              { value: 'hour', label: 'Hour' },
              { value: 'day', label: 'Day' },
              { value: 'week', label: 'Week' },
              { value: 'month', label: 'Month' },
            ]}
          />
        </Stack>
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert
          icon={<IconAlertCircle />}
          title="Connection Error"
          color="red"
          withCloseButton
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {/* Live Data Display */}
      {data && (
        <>
          {/* Key Metrics */}
          <Grid className={classes.metricsGrid}>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Card className={classes.metricCard} shadow="sm" padding="lg" radius="md" withBorder>
                <Group justify="space-between">
                  <div>
                    <Text size="sm" c="dimmed" mb={5}>
                      Total Events
                    </Text>
                    <Text size="xl" fw={700} className={classes.metricValue}>
                      {(data.totalEvents || 0).toLocaleString()}
                    </Text>
                  </div>
                  <RingProgress
                    sections={[{ value: 100, color: 'blue' }]}
                    size={80}
                    thickness={8}
                    label={
                      <Center>
                        <IconClick size={24} />
                      </Center>
                    }
                  />
                </Group>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Card className={classes.metricCard} shadow="sm" padding="lg" radius="md" withBorder>
                <Group justify="space-between">
                  <div>
                    <Text size="sm" c="dimmed" mb={5}>
                      Unique Users
                    </Text>
                    <Text size="xl" fw={700} className={classes.metricValue}>
                      {(data.uniqueUsers || 0).toLocaleString()}
                    </Text>
                  </div>
                  <RingProgress
                    sections={[{ value: 100, color: 'teal' }]}
                    size={80}
                    thickness={8}
                    label={
                      <Center>
                        <IconUsers size={24} />
                      </Center>
                    }
                  />
                </Group>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Card className={classes.metricCard} shadow="sm" padding="lg" radius="md" withBorder>
                <Group justify="space-between">
                  <div>
                    <Text size="sm" c="dimmed" mb={5}>
                      Avg. Events/User
                    </Text>
                    <Text size="xl" fw={700} className={classes.metricValue}>
                      {data.uniqueUsers > 0
                        ? (data.totalEvents / data.uniqueUsers).toFixed(2)
                        : '0'}
                    </Text>
                  </div>
                  <RingProgress
                    sections={[{ value: 100, color: 'violet' }]}
                    size={80}
                    thickness={8}
                    label={
                      <Center>
                        <IconActivity size={24} />
                      </Center>
                    }
                  />
                </Group>
              </Card>
            </Grid.Col>
          </Grid>

          {/* Event Types */}
          {data.eventsByType && data.eventsByType.length > 0 && (
            <Paper className={classes.eventTypesCard} shadow="sm" p="lg" radius="md" withBorder>
              <Text size="lg" fw={600} mb="md">
                Event Types Distribution
              </Text>
              <Stack gap="md">
                {data.eventsByType.map((eventType) => {
                  const percentage = calculatePercentage(eventType.count, data.totalEvents);
                  return (
                    <div key={eventType.eventType}>
                      <Group justify="space-between" mb={5}>
                        <Text size="sm" fw={500}>
                          {eventType.eventType}
                        </Text>
                        <Badge size="sm">{(eventType.count || 0).toLocaleString()} ({percentage}%)</Badge>
                      </Group>
                      <Progress value={percentage} color="blue" size="lg" />
                    </div>
                  );
                })}
              </Stack>
            </Paper>
          )}

          {/* Device Stats */}
          {data.deviceStats && data.deviceStats.length > 0 && (
            <Paper className={classes.deviceStatsCard} shadow="sm" p="lg" radius="md" withBorder>
              <Text size="lg" fw={600} mb="md">
                Device Distribution
              </Text>
              <Grid>
                {data.deviceStats.map((device) => {
                  const percentage = calculatePercentage(device.count, data.totalEvents);
                  return (
                    <Grid.Col key={device.device} span={{ base: 12, sm: 6, md: 4 }}>
                      <Paper className={classes.deviceCard} p="md" withBorder>
                        <Text size="sm" c="dimmed" mb={5}>
                          {device.device}
                        </Text>
                        <Group justify="space-between" align="flex-end">
                          <Text size="xl" fw={700}>
                            {(device.count || 0).toLocaleString()}
                          </Text>
                          <Badge color="cyan" variant="light">
                            {percentage}%
                          </Badge>
                        </Group>
                      </Paper>
                    </Grid.Col>
                  );
                })}
              </Grid>
            </Paper>
          )}

          {/* Top Pages */}
          {data.topPages && data.topPages.length > 0 && (
            <Paper className={classes.topPagesCard} shadow="sm" p="lg" radius="md" withBorder>
              <Text size="lg" fw={600} mb="md">
                Top Pages
              </Text>
              <Stack gap="sm">
                {data.topPages.slice(0, 10).map((page, index) => (
                  <Group key={page.page} justify="space-between" className={classes.pageItem}>
                    <Group gap="sm">
                      <Badge size="lg" variant="filled">
                        #{index + 1}
                      </Badge>
                      <Text size="sm" fw={500}>
                        {page.page}
                      </Text>
                    </Group>
                    <Badge size="lg" color="blue" variant="light">
                      {(page.count || 0).toLocaleString()} visits
                    </Badge>
                  </Group>
                ))}
              </Stack>
            </Paper>
          )}
        </>
      )}

      {!currentUser?.tenantId && (
        <Center className={classes.waiting}>
          <Text c="dimmed">Loading user information...</Text>
        </Center>
      )}

      {currentUser?.tenantId && !data && isConnected && (
        <Center className={classes.waiting}>
          <Text c="dimmed">Waiting for data...</Text>
        </Center>
      )}
    </Container>
  );
};

export default RealTimeStream;

