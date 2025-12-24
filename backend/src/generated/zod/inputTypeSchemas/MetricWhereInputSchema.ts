import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { StringFilterSchema } from './StringFilterSchema';
import { DateTimeFilterSchema } from './DateTimeFilterSchema';
import { FloatFilterSchema } from './FloatFilterSchema';
import { TenantRelationFilterSchema } from './TenantRelationFilterSchema';
import { TenantWhereInputSchema } from './TenantWhereInputSchema';

export const MetricWhereInputSchema: z.ZodType<Prisma.MetricWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => MetricWhereInputSchema), z.lazy(() => MetricWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MetricWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MetricWhereInputSchema), z.lazy(() => MetricWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  tenantId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  serviceName: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  metricName: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  timestamp: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  value: z.union([ z.lazy(() => FloatFilterSchema), z.number() ]).optional(),
  tenant: z.union([ z.lazy(() => TenantRelationFilterSchema), z.lazy(() => TenantWhereInputSchema) ]).optional(),
});

export default MetricWhereInputSchema;
