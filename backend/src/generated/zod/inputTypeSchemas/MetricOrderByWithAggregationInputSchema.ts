import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { SortOrderSchema } from './SortOrderSchema';
import { MetricCountOrderByAggregateInputSchema } from './MetricCountOrderByAggregateInputSchema';
import { MetricAvgOrderByAggregateInputSchema } from './MetricAvgOrderByAggregateInputSchema';
import { MetricMaxOrderByAggregateInputSchema } from './MetricMaxOrderByAggregateInputSchema';
import { MetricMinOrderByAggregateInputSchema } from './MetricMinOrderByAggregateInputSchema';
import { MetricSumOrderByAggregateInputSchema } from './MetricSumOrderByAggregateInputSchema';

export const MetricOrderByWithAggregationInputSchema: z.ZodType<Prisma.MetricOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  tenantId: z.lazy(() => SortOrderSchema).optional(),
  serviceName: z.lazy(() => SortOrderSchema).optional(),
  metricName: z.lazy(() => SortOrderSchema).optional(),
  timestamp: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => MetricCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => MetricAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => MetricMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => MetricMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => MetricSumOrderByAggregateInputSchema).optional(),
});

export default MetricOrderByWithAggregationInputSchema;
