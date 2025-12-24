import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { StringFilterSchema } from './StringFilterSchema';
import { StringNullableFilterSchema } from './StringNullableFilterSchema';
import { DateTimeFilterSchema } from './DateTimeFilterSchema';
import { JsonNullableFilterSchema } from './JsonNullableFilterSchema';
import { TenantRelationFilterSchema } from './TenantRelationFilterSchema';
import { TenantWhereInputSchema } from './TenantWhereInputSchema';
import { UserNullableRelationFilterSchema } from './UserNullableRelationFilterSchema';
import { UserWhereInputSchema } from './UserWhereInputSchema';

export const EventWhereInputSchema: z.ZodType<Prisma.EventWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => EventWhereInputSchema), z.lazy(() => EventWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EventWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EventWhereInputSchema), z.lazy(() => EventWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  tenantId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  sessionId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  eventType: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  timestamp: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  metadata: z.lazy(() => JsonNullableFilterSchema).optional(),
  tenant: z.union([ z.lazy(() => TenantRelationFilterSchema), z.lazy(() => TenantWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserNullableRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional().nullable(),
});

export default EventWhereInputSchema;
