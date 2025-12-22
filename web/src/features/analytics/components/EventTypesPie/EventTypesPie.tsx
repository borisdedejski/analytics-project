import { Paper, Text } from '@mantine/core';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { EventCountByType } from '@/types/analytics';
import classes from './EventTypesPie.module.scss';

interface EventTypesPieProps {
  data: EventCountByType[];
}

const COLORS = ['#0969ff', '#06b6d4', '#8b5cf6', '#f59e0b', '#ef4444'];

export const EventTypesPie = ({ data }: EventTypesPieProps) => {
  const chartData = data.map(item => ({
    name: item.eventType,
    value: item.count,
  }));

  return (
    <Paper p="md" radius="md" withBorder className={classes.card}>
      <div className={classes.header}>
        <Text className={classes.title}>Events by Type</Text>
      </div>
      <div className={classes.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Paper>
  );
};

