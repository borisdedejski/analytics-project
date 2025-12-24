import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { UserWhereUniqueInputSchema } from './UserWhereUniqueInputSchema';
import { UserUpdateWithoutTenantInputSchema } from './UserUpdateWithoutTenantInputSchema';
import { UserUncheckedUpdateWithoutTenantInputSchema } from './UserUncheckedUpdateWithoutTenantInputSchema';

export const UserUpdateWithWhereUniqueWithoutTenantInputSchema: z.ZodType<Prisma.UserUpdateWithWhereUniqueWithoutTenantInput> = z.strictObject({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => UserUpdateWithoutTenantInputSchema), z.lazy(() => UserUncheckedUpdateWithoutTenantInputSchema) ]),
});

export default UserUpdateWithWhereUniqueWithoutTenantInputSchema;
