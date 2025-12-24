import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { UserCreateWithoutTenantInputSchema } from './UserCreateWithoutTenantInputSchema';
import { UserUncheckedCreateWithoutTenantInputSchema } from './UserUncheckedCreateWithoutTenantInputSchema';
import { UserCreateOrConnectWithoutTenantInputSchema } from './UserCreateOrConnectWithoutTenantInputSchema';
import { UserCreateManyTenantInputEnvelopeSchema } from './UserCreateManyTenantInputEnvelopeSchema';
import { UserWhereUniqueInputSchema } from './UserWhereUniqueInputSchema';

export const UserUncheckedCreateNestedManyWithoutTenantInputSchema: z.ZodType<Prisma.UserUncheckedCreateNestedManyWithoutTenantInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutTenantInputSchema), z.lazy(() => UserCreateWithoutTenantInputSchema).array(), z.lazy(() => UserUncheckedCreateWithoutTenantInputSchema), z.lazy(() => UserUncheckedCreateWithoutTenantInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutTenantInputSchema), z.lazy(() => UserCreateOrConnectWithoutTenantInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserCreateManyTenantInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema), z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
});

export default UserUncheckedCreateNestedManyWithoutTenantInputSchema;
