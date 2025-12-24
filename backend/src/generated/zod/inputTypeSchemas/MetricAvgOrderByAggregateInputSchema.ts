import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { SortOrderSchema } from './SortOrderSchema';

export const MetricAvgOrderByAggregateInputSchema: z.ZodType<Prisma.MetricAvgOrderByAggregateInput> = z.strictObject({
  value: z.lazy(() => SortOrderSchema).optional(),
});

export default MetricAvgOrderByAggregateInputSchema;
