import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { TenantUpdateWithoutUsersInputSchema } from './TenantUpdateWithoutUsersInputSchema';
import { TenantUncheckedUpdateWithoutUsersInputSchema } from './TenantUncheckedUpdateWithoutUsersInputSchema';
import { TenantCreateWithoutUsersInputSchema } from './TenantCreateWithoutUsersInputSchema';
import { TenantUncheckedCreateWithoutUsersInputSchema } from './TenantUncheckedCreateWithoutUsersInputSchema';
import { TenantWhereInputSchema } from './TenantWhereInputSchema';

export const TenantUpsertWithoutUsersInputSchema: z.ZodType<Prisma.TenantUpsertWithoutUsersInput> = z.strictObject({
  update: z.union([ z.lazy(() => TenantUpdateWithoutUsersInputSchema), z.lazy(() => TenantUncheckedUpdateWithoutUsersInputSchema) ]),
  create: z.union([ z.lazy(() => TenantCreateWithoutUsersInputSchema), z.lazy(() => TenantUncheckedCreateWithoutUsersInputSchema) ]),
  where: z.lazy(() => TenantWhereInputSchema).optional(),
});

export default TenantUpsertWithoutUsersInputSchema;
