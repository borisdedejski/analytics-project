import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { SortOrderSchema } from './SortOrderSchema';

export const MetricOrderByRelationAggregateInputSchema: z.ZodType<Prisma.MetricOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export default MetricOrderByRelationAggregateInputSchema;
