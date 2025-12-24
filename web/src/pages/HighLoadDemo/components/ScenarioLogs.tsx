import { useRef, useEffect } from 'react';
import { ScrollArea, Stack, Text } from '@mantine/core';
import { ScenarioResult } from '../types';
import classes from '../HighLoadDemo.module.scss';

interface ScenarioLogsProps {
  scenario: ScenarioResult;
  height?: number;
}

export const ScenarioLogs = ({ scenario, height = 400 }: ScenarioLogsProps) => {
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [scenario.logs]);

  return (
    <ScrollArea h={height} className={classes.logs}>
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
  );
};

