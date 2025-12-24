import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { SortOrderSchema } from './SortOrderSchema';

export const MetricSumOrderByAggregateInputSchema: z.ZodType<Prisma.MetricSumOrderByAggregateInput> = z.strictObject({
  value: z.lazy(() => SortOrderSchema).optional(),
});

export default MetricSumOrderByAggregateInputSchema;
