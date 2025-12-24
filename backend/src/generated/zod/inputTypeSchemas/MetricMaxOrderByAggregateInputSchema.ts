import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { SortOrderSchema } from './SortOrderSchema';

export const MetricMaxOrderByAggregateInputSchema: z.ZodType<Prisma.MetricMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  tenantId: z.lazy(() => SortOrderSchema).optional(),
  serviceName: z.lazy(() => SortOrderSchema).optional(),
  metricName: z.lazy(() => SortOrderSchema).optional(),
  timestamp: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
});

export default MetricMaxOrderByAggregateInputSchema;
