import { Paper, Text } from '@mantine/core';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { TimeSeriesDataPoint } from '@/types/analytics';
import classes from './EventsChart.module.scss';

interface EventsChartProps {
  data: TimeSeriesDataPoint[];
}

export const EventsChart = ({ data }: EventsChartProps) => {
  const formattedData = data.map(item => ({
    ...item,
    date: format(new Date(item.timestamp), 'MMM dd'),
  }));

  return (
    <Paper p="md" radius="md" withBorder className={classes.card}>
      <div className={classes.header}>
        <Text className={classes.title}>Events Over Time</Text>
      </div>
      <div className={classes.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#0969ff" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Paper>
  );
};

