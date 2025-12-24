import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { UserWhereUniqueInputSchema } from './UserWhereUniqueInputSchema';
import { UserUpdateWithoutTenantInputSchema } from './UserUpdateWithoutTenantInputSchema';
import { UserUncheckedUpdateWithoutTenantInputSchema } from './UserUncheckedUpdateWithoutTenantInputSchema';
import { UserCreateWithoutTenantInputSchema } from './UserCreateWithoutTenantInputSchema';
import { UserUncheckedCreateWithoutTenantInputSchema } from './UserUncheckedCreateWithoutTenantInputSchema';

export const UserUpsertWithWhereUniqueWithoutTenantInputSchema: z.ZodType<Prisma.UserUpsertWithWhereUniqueWithoutTenantInput> = z.strictObject({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => UserUpdateWithoutTenantInputSchema), z.lazy(() => UserUncheckedUpdateWithoutTenantInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutTenantInputSchema), z.lazy(() => UserUncheckedCreateWithoutTenantInputSchema) ]),
});

export default UserUpsertWithWhereUniqueWithoutTenantInputSchema;
