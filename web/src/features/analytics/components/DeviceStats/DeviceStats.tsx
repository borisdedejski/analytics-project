import { Paper, Text } from '@mantine/core';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DeviceStats as DeviceStatsType } from '@/types/analytics';
import classes from './DeviceStats.module.scss';

interface DeviceStatsProps {
  data: DeviceStatsType[];
}

export const DeviceStats = ({ data }: DeviceStatsProps) => {
  return (
    <Paper p="md" radius="md" withBorder className={classes.card}>
      <div className={classes.header}>
        <Text className={classes.title}>Device Distribution</Text>
      </div>
      <div className={classes.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="device" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#0969ff" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Paper>
  );
};

