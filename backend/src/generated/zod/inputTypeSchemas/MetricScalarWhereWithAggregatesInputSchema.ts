import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { StringWithAggregatesFilterSchema } from './StringWithAggregatesFilterSchema';
import { DateTimeWithAggregatesFilterSchema } from './DateTimeWithAggregatesFilterSchema';
import { FloatWithAggregatesFilterSchema } from './FloatWithAggregatesFilterSchema';

export const MetricScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.MetricScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => MetricScalarWhereWithAggregatesInputSchema), z.lazy(() => MetricScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => MetricScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MetricScalarWhereWithAggregatesInputSchema), z.lazy(() => MetricScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  tenantId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  serviceName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  metricName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  timestamp: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  value: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema), z.number() ]).optional(),
});

export default MetricScalarWhereWithAggregatesInputSchema;
