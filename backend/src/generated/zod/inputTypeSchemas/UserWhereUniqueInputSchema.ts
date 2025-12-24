import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { UserTenantIdEmailCompoundUniqueInputSchema } from './UserTenantIdEmailCompoundUniqueInputSchema';
import { UserWhereInputSchema } from './UserWhereInputSchema';
import { StringFilterSchema } from './StringFilterSchema';
import { DateTimeFilterSchema } from './DateTimeFilterSchema';
import { TenantRelationFilterSchema } from './TenantRelationFilterSchema';
import { TenantWhereInputSchema } from './TenantWhereInputSchema';
import { EventListRelationFilterSchema } from './EventListRelationFilterSchema';

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z.union([
  z.object({
    id: z.string(),
    tenantId_email: z.lazy(() => UserTenantIdEmailCompoundUniqueInputSchema),
  }),
  z.object({
    id: z.string(),
  }),
  z.object({
    tenantId_email: z.lazy(() => UserTenantIdEmailCompoundUniqueInputSchema),
  }),
])
.and(z.strictObject({
  id: z.string().optional(),
  tenantId_email: z.lazy(() => UserTenantIdEmailCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  tenantId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  role: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  tenant: z.union([ z.lazy(() => TenantRelationFilterSchema), z.lazy(() => TenantWhereInputSchema) ]).optional(),
  events: z.lazy(() => EventListRelationFilterSchema).optional(),
}));

export default UserWhereUniqueInputSchema;
