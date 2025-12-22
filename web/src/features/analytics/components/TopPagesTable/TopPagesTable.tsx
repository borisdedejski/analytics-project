import { Paper, Text, Table } from '@mantine/core';
import { TopPage } from '@/types/analytics';
import classes from './TopPagesTable.module.scss';

interface TopPagesTableProps {
  data: TopPage[];
}

export const TopPagesTable = ({ data }: TopPagesTableProps) => {
  return (
    <Paper p="md" radius="md" withBorder className={classes.card}>
      <div className={classes.header}>
        <Text className={classes.title}>Top Pages</Text>
      </div>
      <div className={classes.tableWrapper}>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Page</Table.Th>
              <Table.Th>Views</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.map((item, index) => (
              <Table.Tr key={index}>
                <Table.Td>{item.page}</Table.Td>
                <Table.Td>{item.views.toLocaleString()}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </div>
    </Paper>
  );
};

