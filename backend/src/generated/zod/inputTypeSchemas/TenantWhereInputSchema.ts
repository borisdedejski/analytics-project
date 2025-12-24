import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { StringFilterSchema } from './StringFilterSchema';
import { DateTimeFilterSchema } from './DateTimeFilterSchema';
import { UserListRelationFilterSchema } from './UserListRelationFilterSchema';
import { EventListRelationFilterSchema } from './EventListRelationFilterSchema';
import { MetricListRelationFilterSchema } from './MetricListRelationFilterSchema';

export const TenantWhereInputSchema: z.ZodType<Prisma.TenantWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => TenantWhereInputSchema), z.lazy(() => TenantWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TenantWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TenantWhereInputSchema), z.lazy(() => TenantWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  region: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  plan: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  users: z.lazy(() => UserListRelationFilterSchema).optional(),
  events: z.lazy(() => EventListRelationFilterSchema).optional(),
  metrics: z.lazy(() => MetricListRelationFilterSchema).optional(),
});

export default TenantWhereInputSchema;
