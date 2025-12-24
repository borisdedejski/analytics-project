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
import { usersApi, User } from '@/shared/api/users';
import { ApiError } from '@/shared/api/client';
import { useAuthStore } from '@/store/authStore';
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
  const { currentUser } = useAuthStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedEventType, setSelectedEventType] = useState<string>('click');
  const [numberOfEvents, setNumberOfEvents] = useState<number>(10);
  const [userId, setUserId] = useState<string>(currentUser?.id || '');
  const [customDate, setCustomDate] = useState<Date | null>(null);
  const [stats, setStats] = useState<EventStats>({ total: 0, byType: {} });
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(currentUser?.tenantId || null);
  const [isLoadingTenant, setIsLoadingTenant] = useState(!currentUser);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);

  // Fetch tenant on mount (use currentUser if available)
  useEffect(() => {
    const fetchTenant = async () => {
      // If we have currentUser, use their tenantId
      if (currentUser) {
        setTenantId(currentUser.tenantId);
        setUserId(currentUser.id);
        setIsLoadingTenant(false);
        return;
      }

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
  }, [currentUser]);

  // Fetch users when tenant is loaded
  useEffect(() => {
    const fetchUsers = async () => {
      if (!tenantId) return;
      
      setIsLoadingUsers(true);
      try {
        const fetchedUsers = await usersApi.getUsers(tenantId);
        
        // If currentUser exists, put them first in the list
        if (currentUser) {
          const otherUsers = fetchedUsers.filter((u) => u.id !== currentUser.id);
          setUsers([currentUser, ...otherUsers]);
          // Keep userId as currentUser's id
          setUserId(currentUser.id);
        } else {
          setUsers(fetchedUsers);
          // Default to first user or anonymous
          if (fetchedUsers.length > 0) {
            setUserId(fetchedUsers[0].id);
          } else {
            setUserId('');
          }
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
        // On error, use currentUser if available, otherwise anonymous
        if (currentUser) {
          setUsers([currentUser]);
          setUserId(currentUser.id);
        } else {
          setUserId('');
        }
        setNotification({
          type: 'error',
          message: 'Failed to fetch users. Events will be created with your user.',
        });
      } finally {
        setIsLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [tenantId, currentUser]);

  const generateRandomEvent = () => {
    // Use custom date if provided, otherwise use current time
    const eventDate = customDate || new Date();
    
    return {
      tenantId: tenantId || undefined,
      eventType: selectedEventType,
      userId: userId && userId.trim() !== '' ? userId : undefined, // Only send if not empty
      sessionId: `session_${Math.random().toString(36).substring(7)}`,
      page: getRandomItem(PAGES),
      browser: getRandomItem(BROWSERS),
      device: getRandomItem(DEVICES),
      country: getRandomItem(COUNTRIES),
      timestamp: eventDate.toISOString(),
      metadata: {
        randomValue: Math.floor(Math.random() * 1000),
      },
    };
  };

  /**
   * Process events in batches to avoid rate limiting
   * @param events Array of events to create
   * @param batchSize Number of events to process concurrently
   * @param delayMs Delay between batches in milliseconds
   */
  const processBatchedEvents = async (
    events: any[],
    batchSize: number = 10,
    delayMs: number = 100
  ) => {
    const results = [];
    const total = events.length;
    let retryCount = 0;
    const maxRetries = 3;

    for (let i = 0; i < events.length; i += batchSize) {
      const batch = events.slice(i, i + batchSize);
      
      // Update progress
      setProgress({ current: Math.min(i + batchSize, total), total });

      let success = false;
      let lastError: Error | null = null;

      // Retry logic for this batch
      while (!success && retryCount < maxRetries) {
        try {
          // Process batch in parallel
          const batchResults = await Promise.all(
            batch.map((event) => eventsApi.createEvent(event))
          );
          results.push(...batchResults);
          success = true;

          // Add delay between batches (except for the last batch)
          if (i + batchSize < events.length) {
            await new Promise((resolve) => setTimeout(resolve, delayMs));
          }
        } catch (error) {
          lastError = error as Error;
          
          // If rate limited, wait and retry
          if (error instanceof ApiError && error.status === 429) {
            const waitTime = error.retryAfter ? error.retryAfter * 1000 : 2000;
            console.log(`Rate limited, waiting ${waitTime / 1000} seconds before retry...`);
            
            retryCount++;
            if (retryCount < maxRetries) {
              await new Promise((resolve) => setTimeout(resolve, waitTime));
            }
          } else {
            // For other errors, don't retry
            throw error;
          }
        }
      }

      // If we exhausted all retries, throw the last error
      if (!success && lastError) {
        throw lastError;
      }

      // Reset retry count for next batch
      retryCount = 0;
    }

    setProgress(null);
    return results;
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
      const events = [];
      for (let i = 0; i < numberOfEvents; i++) {
        const event = generateRandomEvent();
        if (i === 0) {
          console.log('Sample event being generated:', event);
        }
        events.push(event);
      }

      // Process events in batches to avoid rate limiting
      await processBatchedEvents(events, 10, 100);

      // Update stats
      setStats((prev) => ({
        total: prev.total + numberOfEvents,
        byType: {
          ...prev.byType,
          [selectedEventType]: (prev.byType[selectedEventType] || 0) + numberOfEvents,
        },
      }));

      // Clear backend Redis cache (pass tenantId to ensure proper cache invalidation)
      await analyticsApi.clearCache(tenantId || undefined);
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
      setProgress(null);
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
      const events = [];
      const bulkCount = 50;

      for (let i = 0; i < bulkCount; i++) {
        const randomEventType = getRandomItem(EVENT_TYPES).value;
        // Use custom date if provided, otherwise use current time
        const eventDate = customDate || new Date();
        
        const event = {
          tenantId: tenantId || undefined,
          eventType: randomEventType,
          userId: userId && userId.trim() !== '' ? userId : undefined, // Use selected user
          sessionId: `session_${Math.random().toString(36).substring(7)}`,
          page: getRandomItem(PAGES),
          browser: getRandomItem(BROWSERS),
          device: getRandomItem(DEVICES),
          country: getRandomItem(COUNTRIES),
          timestamp: eventDate.toISOString(),
          metadata: {
            randomValue: Math.floor(Math.random() * 1000),
          },
        };
        if (i === 0) {
          console.log('Sample bulk event being generated:', event);
          console.log('Current tenantId:', tenantId);
          console.log('Current userId:', userId);
        }
        events.push(event);
      }

      // Process events in batches to avoid rate limiting
      await processBatchedEvents(events, 10, 100);

      // Clear backend Redis cache (pass tenantId to ensure proper cache invalidation)
      await analyticsApi.clearCache(tenantId || undefined);
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
      setProgress(null);
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

                  <Select
                    label="User"
                    placeholder={isLoadingUsers ? "Loading users..." : "Select a user"}
                    value={userId}
                    onChange={(value) => setUserId(value || '')}
                    data={[
                      ...(users.length > 0
                        ? [
                            {
                              value: users[0].id,
                              label: `👤 ME (${users[0].email})`,
                            },
                            ...users.slice(1).map((user) => ({
                              value: user.id,
                              label: `${user.email} (${user.role})`,
                            })),
                          ]
                        : []),
                      {
                        value: '',
                        label: '🔓 Anonymous (no user)',
                      },
                    ]}
                    size="md"
                    disabled={isLoadingUsers || users.length === 0}
                    description={
                      users.length === 0
                        ? 'No users found. Events will be anonymous.'
                        : 'Select a user to associate with events. Defaults to ME (you).'
                    }
                    clearable={false}
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

              {progress && (
                <Alert icon={<IconRocket />} title="Generating Events" color="blue">
                  Processing {progress.current} of {progress.total} events...
                </Alert>
              )}

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
                1. Events default to "ME" (your user)
              </Text>
              <Text size="sm" c="dimmed">
                2. Select an event type and quantity
              </Text>
              <Text size="sm" c="dimmed">
                3. Optionally set a custom date or different user
              </Text>
              <Text size="sm" c="dimmed">
                4. Click "Generate Events" to create them
              </Text>
              <Text size="sm" c="dimmed">
                5. Navigate to Dashboard to see real-time updates
              </Text>
              <Text size="sm" c="dimmed">
                6. Events include random devices, browsers, and pages
              </Text>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

