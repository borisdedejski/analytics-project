import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { StringFilterSchema } from './StringFilterSchema';
import { DateTimeFilterSchema } from './DateTimeFilterSchema';
import { FloatFilterSchema } from './FloatFilterSchema';

export const MetricScalarWhereInputSchema: z.ZodType<Prisma.MetricScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => MetricScalarWhereInputSchema), z.lazy(() => MetricScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MetricScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MetricScalarWhereInputSchema), z.lazy(() => MetricScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  tenantId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  serviceName: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  metricName: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  timestamp: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  value: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
});

export default MetricScalarWhereInputSchema;
