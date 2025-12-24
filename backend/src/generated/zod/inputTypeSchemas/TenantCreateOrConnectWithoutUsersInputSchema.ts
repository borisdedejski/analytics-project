import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { TenantWhereUniqueInputSchema } from './TenantWhereUniqueInputSchema';
import { TenantCreateWithoutUsersInputSchema } from './TenantCreateWithoutUsersInputSchema';
import { TenantUncheckedCreateWithoutUsersInputSchema } from './TenantUncheckedCreateWithoutUsersInputSchema';

export const TenantCreateOrConnectWithoutUsersInputSchema: z.ZodType<Prisma.TenantCreateOrConnectWithoutUsersInput> = z.strictObject({
  where: z.lazy(() => TenantWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TenantCreateWithoutUsersInputSchema), z.lazy(() => TenantUncheckedCreateWithoutUsersInputSchema) ]),
});

export default TenantCreateOrConnectWithoutUsersInputSchema;
