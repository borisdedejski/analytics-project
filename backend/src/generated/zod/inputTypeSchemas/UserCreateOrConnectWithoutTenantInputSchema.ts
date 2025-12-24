import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { UserWhereUniqueInputSchema } from './UserWhereUniqueInputSchema';
import { UserCreateWithoutTenantInputSchema } from './UserCreateWithoutTenantInputSchema';
import { UserUncheckedCreateWithoutTenantInputSchema } from './UserUncheckedCreateWithoutTenantInputSchema';

export const UserCreateOrConnectWithoutTenantInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutTenantInput> = z.strictObject({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutTenantInputSchema), z.lazy(() => UserUncheckedCreateWithoutTenantInputSchema) ]),
});

export default UserCreateOrConnectWithoutTenantInputSchema;
