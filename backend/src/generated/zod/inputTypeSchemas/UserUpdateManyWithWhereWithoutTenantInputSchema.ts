import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { UserScalarWhereInputSchema } from './UserScalarWhereInputSchema';
import { UserUpdateManyMutationInputSchema } from './UserUpdateManyMutationInputSchema';
import { UserUncheckedUpdateManyWithoutTenantInputSchema } from './UserUncheckedUpdateManyWithoutTenantInputSchema';

export const UserUpdateManyWithWhereWithoutTenantInputSchema: z.ZodType<Prisma.UserUpdateManyWithWhereWithoutTenantInput> = z.strictObject({
  where: z.lazy(() => UserScalarWhereInputSchema),
  data: z.union([ z.lazy(() => UserUpdateManyMutationInputSchema), z.lazy(() => UserUncheckedUpdateManyWithoutTenantInputSchema) ]),
});

export default UserUpdateManyWithWhereWithoutTenantInputSchema;
