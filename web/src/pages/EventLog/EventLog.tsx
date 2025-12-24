import {
  Container,
  Title,
  Text,
  Paper,
  Table,
  Button,
  Group,
  Stack,
  Badge,
  Loader,
  Alert,
  Select,
  Center,
  Tooltip,
  Code,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import {
  IconClock,
  IconList,
  IconAlertCircle,
  IconRefresh,
  IconArrowLeft,
  IconArrowRight,
  IconUser,
  IconDeviceDesktop,
  IconWorldWww,
  IconMapPin,
  IconId,
  IconFilter,
} from '@tabler/icons-react';
import { format } from 'date-fns';
import { useEventLog } from './hooks/useEventLog';
import classes from './EventLog.module.scss';

export const EventLog = () => {
  const {
    data,
    isLoading,
    error,
    isFetching,
    startDate,
    endDate,
    eventType,
    eventTypes,
    pageSize,
    handleStartDateChange,
    handleEndDateChange,
    handleEventTypeChange,
    handlePageSizeChange,
    currentPage,
    totalPages,
    canGoBack,
    canGoForward,
    handleNextPage,
    handlePreviousPage,
    handleRefresh,
    getEventTypeColor,
  } = useEventLog();

  return (
    <Container className={classes.container} size="xl">
      <div className={classes.header}>
        <Group justify="space-between" align="center">
          <div>
            <Title className={classes.title}>
              <IconList size={36} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
              Event Log
            </Title>
            <Text className={classes.subtitle}>
              View individual event logs with detailed information about user actions
            </Text>
          </div>
          <Button
            leftSection={<IconRefresh size={18} />}
            onClick={handleRefresh}
            loading={isFetching}
            variant="light"
          >
            Refresh
          </Button>
        </Group>
      </div>

      {/* Filters */}
      <Paper className={classes.filtersCard} shadow="sm" p="lg" radius="md" withBorder>
        <Text size="sm" fw={600} mb="md" c="dimmed">
          <IconFilter size={16} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
          Filter Events
        </Text>
        <Stack gap="md">
          <Group grow>
            <DateInput
              label="Start Date"
              value={startDate}
              onChange={handleStartDateChange}
              maxDate={endDate}
              placeholder="Select start date"
            />
            <DateInput
              label="End Date"
              value={endDate}
              onChange={handleEndDateChange}
              minDate={startDate}
              maxDate={new Date()}
              placeholder="Select end date"
            />
          </Group>
          <Group grow>
            <Select
              label="Event Type"
              value={eventType}
              onChange={handleEventTypeChange}
              placeholder="All event types"
              clearable
              data={eventTypes.map(type => ({ value: type, label: type }))}
              searchable
            />
            <Select
              label="Page Size"
              value={String(pageSize)}
              onChange={handlePageSizeChange}
              data={[
                { value: '10', label: '10 events' },
                { value: '25', label: '25 events' },
                { value: '50', label: '50 events' },
                { value: '100', label: '100 events' },
              ]}
            />
          </Group>
        </Stack>
      </Paper>

      {/* Summary Stats */}
      {data && (
        <Paper className={classes.statsCard} shadow="sm" p="lg" radius="md" withBorder>
          <Group justify="space-between">
            <div>
              <Text size="sm" c="dimmed">Total Events</Text>
              <Text size="xl" fw={700}>{data.total.toLocaleString()}</Text>
            </div>
            <div>
              <Text size="sm" c="dimmed">Current Page</Text>
              <Text size="xl" fw={700}>{data.page} / {totalPages}</Text>
            </div>
            <div>
              <Text size="sm" c="dimmed">Showing</Text>
              <Text size="xl" fw={700}>{data.events.length} events</Text>
            </div>
            <div>
              <Text size="sm" c="dimmed">Filter</Text>
              <Text size="xl" fw={700}>{eventType || 'All Types'}</Text>
            </div>
          </Group>
        </Paper>
      )}

      {/* Error Alert */}
      {error && (
        <Alert
          icon={<IconAlertCircle />}
          title="Error"
          color="red"
        >
          {error.message}
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && (
        <Center className={classes.loader}>
          <Loader size="lg" />
        </Center>
      )}

      {/* Data Table */}
      {!isLoading && data && (
        <>
          <Paper className={classes.tableCard} shadow="sm" radius="md" withBorder>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Timestamp</Table.Th>
                  <Table.Th>Event Type</Table.Th>
                  <Table.Th>User</Table.Th>
                  <Table.Th>Device Info</Table.Th>
                  <Table.Th>Page</Table.Th>
                  <Table.Th>Details</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {data.events.map((event) => (
                  <Table.Tr key={event.id}>
                    {/* Timestamp */}
                    <Table.Td>
                      <Group gap="xs" wrap="nowrap">
                        <IconClock size={16} />
                        <div>
                          <Text size="sm" fw={500}>
                            {format(new Date(event.timestamp), 'MMM dd, yyyy')}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {format(new Date(event.timestamp), 'HH:mm:ss')}
                          </Text>
                        </div>
                      </Group>
                    </Table.Td>

                    {/* Event Type */}
                    <Table.Td>
                      <Badge size="md" variant="filled" color={getEventTypeColor(event.eventType)}>
                        {event.eventType}
                      </Badge>
                    </Table.Td>

                    {/* User */}
                    <Table.Td>
                      {event.userId ? (
                        <Tooltip label={`User ID: ${event.userId}`}>
                          <Group gap="xs" wrap="nowrap">
                            <IconUser size={16} />
                            <Code style={{ fontSize: '11px' }}>
                              {event.userId.substring(0, 8)}...
                            </Code>
                          </Group>
                        </Tooltip>
                      ) : (
                        <Text size="sm" c="dimmed">Anonymous</Text>
                      )}
                    </Table.Td>

                    {/* Device Info */}
                    <Table.Td>
                      <Stack gap={4}>
                        {event.device && (
                          <Group gap="xs" wrap="nowrap">
                            <IconDeviceDesktop size={14} />
                            <Text size="xs">{event.device}</Text>
                          </Group>
                        )}
                        {event.browser && (
                          <Group gap="xs" wrap="nowrap">
                            <IconWorldWww size={14} />
                            <Text size="xs">{event.browser}</Text>
                          </Group>
                        )}
                        {event.country && (
                          <Group gap="xs" wrap="nowrap">
                            <IconMapPin size={14} />
                            <Text size="xs">{event.country}</Text>
                          </Group>
                        )}
                      </Stack>
                    </Table.Td>

                    {/* Page */}
                    <Table.Td>
                      {event.page ? (
                        <Code style={{ fontSize: '11px' }}>{event.page}</Code>
                      ) : (
                        <Text size="sm" c="dimmed">-</Text>
                      )}
                    </Table.Td>

                    {/* Details */}
                    <Table.Td>
                      <Stack gap={4}>
                        {event.sessionId && (
                          <Tooltip label={`Session: ${event.sessionId}`}>
                            <Group gap="xs" wrap="nowrap">
                              <IconId size={14} />
                              <Text size="xs" c="dimmed">
                                Session: {event.sessionId.substring(0, 8)}...
                              </Text>
                            </Group>
                          </Tooltip>
                        )}
                        {event.metadata && Object.keys(event.metadata).length > 0 && (
                          <Tooltip label={JSON.stringify(event.metadata, null, 2)}>
                            <Badge size="xs" variant="light" color="gray">
                              {Object.keys(event.metadata).length} metadata fields
                            </Badge>
                          </Tooltip>
                        )}
                      </Stack>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>

            {data.events.length === 0 && (
              <Center className={classes.noData}>
                <Stack align="center" gap="xs">
                  <Text c="dimmed">No events found for the selected filters</Text>
                  <Text size="sm" c="dimmed">
                    Try adjusting your date range or event type filter
                  </Text>
                </Stack>
              </Center>
            )}
          </Paper>

          {/* Pagination Controls */}
          <Group justify="center" className={classes.pagination}>
            <Button
              leftSection={<IconArrowLeft size={16} />}
              onClick={handlePreviousPage}
              disabled={!canGoBack || isFetching}
              variant="default"
            >
              Previous
            </Button>
            <Badge size="lg" variant="light">
              Page {currentPage} of {totalPages}
            </Badge>
            <Button
              rightSection={<IconArrowRight size={16} />}
              onClick={handleNextPage}
              disabled={!canGoForward || isFetching}
              variant="default"
            >
              Next
            </Button>
          </Group>
        </>
      )}
    </Container>
  );
};

export default EventLog;

