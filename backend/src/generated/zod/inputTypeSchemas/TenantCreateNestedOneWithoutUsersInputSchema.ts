import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { TenantCreateWithoutUsersInputSchema } from './TenantCreateWithoutUsersInputSchema';
import { TenantUncheckedCreateWithoutUsersInputSchema } from './TenantUncheckedCreateWithoutUsersInputSchema';
import { TenantCreateOrConnectWithoutUsersInputSchema } from './TenantCreateOrConnectWithoutUsersInputSchema';
import { TenantWhereUniqueInputSchema } from './TenantWhereUniqueInputSchema';

export const TenantCreateNestedOneWithoutUsersInputSchema: z.ZodType<Prisma.TenantCreateNestedOneWithoutUsersInput> = z.strictObject({
  create: z.union([ z.lazy(() => TenantCreateWithoutUsersInputSchema), z.lazy(() => TenantUncheckedCreateWithoutUsersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TenantCreateOrConnectWithoutUsersInputSchema).optional(),
  connect: z.lazy(() => TenantWhereUniqueInputSchema).optional(),
});

export default TenantCreateNestedOneWithoutUsersInputSchema;
