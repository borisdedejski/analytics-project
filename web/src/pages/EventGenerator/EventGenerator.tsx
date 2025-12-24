import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Text,
  Button,
  Card,
  Group,
  Stack,
  Select,
  NumberInput,
  Badge,
  Alert,
  TextInput,
  Grid,
  Paper,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useQueryClient } from '@tanstack/react-query';
import {
  IconRocket,
  IconClick,
  IconEye,
  IconShoppingCart,
  IconUser,
  IconCheck,
  IconAlertCircle,
  IconCalendar,
} from '@tabler/icons-react';
import { eventsApi } from '@/shared/api/events';
import { tenantsApi } from '@/shared/api/tenants';
import { analyticsApi } from '@/shared/api/analytics';
import classes from './EventGenerator.module.scss';

interface EventStats {
  total: number;
  byType: Record<string, number>;
}

const EVENT_TYPES = [
  { value: 'click', label: 'Click', icon: IconClick, color: 'blue' },
  { value: 'view', label: 'Page View', icon: IconEye, color: 'cyan' },
  { value: 'purchase', label: 'Purchase', icon: IconShoppingCart, color: 'green' },
  { value: 'signup', label: 'Sign Up', icon: IconUser, color: 'violet' },
];

const DEVICES = ['desktop', 'mobile', 'tablet'];
const BROWSERS = ['Chrome', 'Firefox', 'Safari', 'Edge'];
const COUNTRIES = ['USA', 'UK', 'Canada', 'Germany', 'France', 'Japan', 'Australia'];
const PAGES = ['/home', '/products', '/about', '/contact', '/checkout', '/profile'];

const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const EventGenerator = () => {
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedEventType, setSelectedEventType] = useState<string>('click');
  const [numberOfEvents, setNumberOfEvents] = useState<number>(10);
  const [userId, setUserId] = useState<string>('');
  const [customDate, setCustomDate] = useState<Date | null>(null);
  const [stats, setStats] = useState<EventStats>({ total: 0, byType: {} });
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [isLoadingTenant, setIsLoadingTenant] = useState(true);

  // Fetch tenant on mount
  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const tenants = await tenantsApi.getTenants();
        if (tenants.length > 0) {
          setTenantId(tenants[0].id);
        } else {
          setNotification({
            type: 'error',
            message: 'No tenants found. Please seed the database first.',
          });
        }
      } catch (error) {
        console.error('Failed to fetch tenants:', error);
        setNotification({
          type: 'error',
          message: 'Failed to fetch tenant information. Please try again.',
        });
      } finally {
        setIsLoadingTenant(false);
      }
    };

    fetchTenant();
  }, []);

  const generateRandomEvent = () => {
    // Use custom date if provided, otherwise use current time
    const eventDate = customDate || new Date();
    
    return {
      tenantId: tenantId || undefined,
      eventType: selectedEventType,
      userId: userId || undefined, // Only send if explicitly provided
      sessionId: `session_${Math.random().toString(36).substring(7)}`,
      page: getRandomItem(PAGES),
      browser: getRandomItem(BROWSERS),
      device: getRandomItem(DEVICES),
      country: getRandomItem(COUNTRIES),
      timestamp: eventDate.toISOString(),
      metadata: {
        randomValue: Math.floor(Math.random() * 1000),
        // Store a random user identifier in metadata instead
        userIdentifier: !userId ? `user_${Math.random().toString(36).substring(7)}` : undefined,
      },
    };
  };

  const generateEvents = async () => {
    if (!tenantId) {
      setNotification({
        type: 'error',
        message: 'No tenant available. Please seed the database first.',
      });
      return;
    }

    setIsGenerating(true);
    setNotification(null);

    try {
      const promises = [];
      for (let i = 0; i < numberOfEvents; i++) {
        const event = generateRandomEvent();
        if (i === 0) {
          console.log('Sample event being generated:', event);
        }
        promises.push(eventsApi.createEvent(event));
      }

      await Promise.all(promises);

      // Update stats
      setStats((prev) => ({
        total: prev.total + numberOfEvents,
        byType: {
          ...prev.byType,
          [selectedEventType]: (prev.byType[selectedEventType] || 0) + numberOfEvents,
        },
      }));

      // Clear backend Redis cache
      await analyticsApi.clearCache();
      // Invalidate queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: ['analytics'] });

      setNotification({
        type: 'success',
        message: `Successfully generated ${numberOfEvents} ${selectedEventType} event(s)!`,
      });
    } catch (error) {
      console.error('Error generating events:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setNotification({
        type: 'error',
        message: `Failed to generate events: ${errorMessage}`,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateBulkRandomEvents = async () => {
    if (!tenantId) {
      setNotification({
        type: 'error',
        message: 'No tenant available. Please seed the database first.',
      });
      return;
    }

    setIsGenerating(true);
    setNotification(null);

    try {
      const promises = [];
      const bulkCount = 50;

      for (let i = 0; i < bulkCount; i++) {
        const randomEventType = getRandomItem(EVENT_TYPES).value;
        // Use custom date if provided, otherwise use current time
        const eventDate = customDate || new Date();
        
        const event = {
          tenantId: tenantId || undefined,
          eventType: randomEventType,
          userId: undefined, // Don't send random user IDs
          sessionId: `session_${Math.random().toString(36).substring(7)}`,
          page: getRandomItem(PAGES),
          browser: getRandomItem(BROWSERS),
          device: getRandomItem(DEVICES),
          country: getRandomItem(COUNTRIES),
          timestamp: eventDate.toISOString(),
          metadata: {
            randomValue: Math.floor(Math.random() * 1000),
            // Store a random user identifier in metadata instead
            userIdentifier: `user_${Math.random().toString(36).substring(7)}`,
          },
        };
        if (i === 0) {
          console.log('Sample bulk event being generated:', event);
          console.log('Current tenantId:', tenantId);
        }
        promises.push(eventsApi.createEvent(event));
      }

      await Promise.all(promises);

      // Clear backend Redis cache
      await analyticsApi.clearCache();
      // Invalidate queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: ['analytics'] });

      setNotification({
        type: 'success',
        message: `Successfully generated ${bulkCount} random events across all types!`,
      });
    } catch (error) {
      console.error('Error generating bulk events:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setNotification({
        type: 'error',
        message: `Failed to generate bulk events: ${errorMessage}`,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Container className={classes.container} size="xl">
      <div className={classes.header}>
        <Title className={classes.title}>
          <IconRocket size={40} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
          Event Generator
        </Title>
        <Text className={classes.subtitle}>
          Generate sample events to see real-time analytics updates
        </Text>
      </div>

      {isLoadingTenant && (
        <Alert
          icon={<IconAlertCircle />}
          title="Loading"
          color="blue"
          className={classes.notification}
        >
          Loading tenant information...
        </Alert>
      )}

      {!isLoadingTenant && !tenantId && (
        <Alert
          icon={<IconAlertCircle />}
          title="No Tenant Available"
          color="yellow"
          className={classes.notification}
        >
          No tenants found in the database. Please run the seed script first: <code>npm run seed</code>
        </Alert>
      )}

      {notification && (
        <Alert
          icon={notification.type === 'success' ? <IconCheck /> : <IconAlertCircle />}
          title={notification.type === 'success' ? 'Success' : 'Error'}
          color={notification.type === 'success' ? 'green' : 'red'}
          className={classes.notification}
          onClose={() => setNotification(null)}
          withCloseButton
        >
          {notification.message}
        </Alert>
      )}

      <Grid className={classes.grid}>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card className={classes.card} shadow="sm" padding="lg" radius="md" withBorder>
            <Stack gap="md">
              <div>
                <Text size="lg" fw={600} mb="md">
                  Event Configuration
                </Text>
                <Stack gap="sm">
                  <Select
                    label="Event Type"
                    placeholder="Select event type"
                    value={selectedEventType}
                    onChange={(value) => setSelectedEventType(value || 'click')}
                    data={EVENT_TYPES.map((et) => ({ value: et.value, label: et.label }))}
                    size="md"
                  />

                  <NumberInput
                    label="Number of Events"
                    placeholder="Enter number of events"
                    value={numberOfEvents}
                    onChange={(value) => setNumberOfEvents(Number(value) || 1)}
                    min={1}
                    max={1000}
                    size="md"
                  />

                  <TextInput
                    label="User ID (Optional)"
                    placeholder="Enter a valid user UUID (leave empty for anonymous events)"
                    value={userId}
                    onChange={(event) => setUserId(event.currentTarget.value)}
                    size="md"
                    description="Must be a valid UUID from the users table"
                  />

                  <DateInput
                    label="Event Date (Optional)"
                    placeholder="Pick a date (defaults to now)"
                    value={customDate}
                    onChange={setCustomDate}
                    size="md"
                    maxDate={new Date()}
                    clearable
                    leftSection={<IconCalendar size={18} />}
                    description="Set a custom date for generated events"
                  />
                </Stack>
              </div>

              <Group gap="sm">
                <Button
                  onClick={generateEvents}
                  loading={isGenerating}
                  disabled={isLoadingTenant || !tenantId}
                  size="md"
                  leftSection={<IconRocket size={20} />}
                  fullWidth
                >
                  Generate Events
                </Button>
              </Group>

              <div className={classes.divider}>
                <Text size="sm" c="dimmed">
                  OR
                </Text>
              </div>

              <Button
                onClick={generateBulkRandomEvents}
                loading={isGenerating}
                disabled={isLoadingTenant || !tenantId}
                size="md"
                variant="light"
                color="violet"
                fullWidth
              >
                Generate 50 Random Events (All Types)
              </Button>
            </Stack>
          </Card>

          <Card className={classes.card} shadow="sm" padding="lg" radius="md" withBorder>
            <Text size="lg" fw={600} mb="md">
              Event Type Templates
            </Text>
            <Grid>
              {EVENT_TYPES.map((eventType) => {
                const Icon = eventType.icon;
                return (
                  <Grid.Col key={eventType.value} span={{ base: 12, sm: 6 }}>
                    <Paper className={classes.eventTypeCard} p="md" withBorder>
                      <Group>
                        <Icon size={32} color={`var(--mantine-color-${eventType.color}-6)`} />
                        <div style={{ flex: 1 }}>
                          <Text fw={500}>{eventType.label}</Text>
                          <Badge color={eventType.color} size="sm">
                            {eventType.value}
                          </Badge>
                        </div>
                      </Group>
                    </Paper>
                  </Grid.Col>
                );
              })}
            </Grid>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card className={classes.statsCard} shadow="sm" padding="lg" radius="md" withBorder>
            <Text size="lg" fw={600} mb="md">
              Session Statistics
            </Text>
            <Stack gap="md">
              <Paper className={classes.statItem} p="md" withBorder>
                <Text size="sm" c="dimmed" mb={4}>
                  Total Events Generated
                </Text>
                <Text size="xl" fw={700}>
                  {stats.total.toLocaleString()}
                </Text>
              </Paper>

              {Object.keys(stats.byType).length > 0 && (
                <div>
                  <Text size="sm" fw={500} mb="xs">
                    By Type:
                  </Text>
                  <Stack gap="xs">
                    {Object.entries(stats.byType).map(([type, count]) => {
                      const eventType = EVENT_TYPES.find((et) => et.value === type);
                      return (
                        <Group key={type} justify="space-between">
                          <Badge color={eventType?.color || 'gray'}>{type}</Badge>
                          <Text fw={500}>{count}</Text>
                        </Group>
                      );
                    })}
                  </Stack>
                </div>
              )}
            </Stack>
          </Card>

          <Card className={classes.infoCard} shadow="sm" padding="lg" radius="md" withBorder>
            <Text size="md" fw={600} mb="sm">
              💡 How it works
            </Text>
            <Stack gap="xs">
              <Text size="sm" c="dimmed">
                1. Select an event type and quantity
              </Text>
              <Text size="sm" c="dimmed">
                2. Optionally set a custom date for events
              </Text>
              <Text size="sm" c="dimmed">
                3. Click "Generate Events" to create them
              </Text>
              <Text size="sm" c="dimmed">
                4. Navigate to Dashboard to see real-time updates
              </Text>
              <Text size="sm" c="dimmed">
                5. Events include random identifiers, devices, browsers, and pages
              </Text>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

