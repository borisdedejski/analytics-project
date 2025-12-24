import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { MetricWhereInputSchema } from './MetricWhereInputSchema';

export const MetricListRelationFilterSchema: z.ZodType<Prisma.MetricListRelationFilter> = z.strictObject({
  every: z.lazy(() => MetricWhereInputSchema).optional(),
  some: z.lazy(() => MetricWhereInputSchema).optional(),
  none: z.lazy(() => MetricWhereInputSchema).optional(),
});

export default MetricListRelationFilterSchema;
