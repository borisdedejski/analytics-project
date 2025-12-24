import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { UserCreateWithoutTenantInputSchema } from './UserCreateWithoutTenantInputSchema';
import { UserUncheckedCreateWithoutTenantInputSchema } from './UserUncheckedCreateWithoutTenantInputSchema';
import { UserCreateOrConnectWithoutTenantInputSchema } from './UserCreateOrConnectWithoutTenantInputSchema';
import { UserUpsertWithWhereUniqueWithoutTenantInputSchema } from './UserUpsertWithWhereUniqueWithoutTenantInputSchema';
import { UserCreateManyTenantInputEnvelopeSchema } from './UserCreateManyTenantInputEnvelopeSchema';
import { UserWhereUniqueInputSchema } from './UserWhereUniqueInputSchema';
import { UserUpdateWithWhereUniqueWithoutTenantInputSchema } from './UserUpdateWithWhereUniqueWithoutTenantInputSchema';
import { UserUpdateManyWithWhereWithoutTenantInputSchema } from './UserUpdateManyWithWhereWithoutTenantInputSchema';
import { UserScalarWhereInputSchema } from './UserScalarWhereInputSchema';

export const UserUncheckedUpdateManyWithoutTenantNestedInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyWithoutTenantNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutTenantInputSchema), z.lazy(() => UserCreateWithoutTenantInputSchema).array(), z.lazy(() => UserUncheckedCreateWithoutTenantInputSchema), z.lazy(() => UserUncheckedCreateWithoutTenantInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutTenantInputSchema), z.lazy(() => UserCreateOrConnectWithoutTenantInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserUpsertWithWhereUniqueWithoutTenantInputSchema), z.lazy(() => UserUpsertWithWhereUniqueWithoutTenantInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserCreateManyTenantInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UserWhereUniqueInputSchema), z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserWhereUniqueInputSchema), z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserWhereUniqueInputSchema), z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema), z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserUpdateWithWhereUniqueWithoutTenantInputSchema), z.lazy(() => UserUpdateWithWhereUniqueWithoutTenantInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserUpdateManyWithWhereWithoutTenantInputSchema), z.lazy(() => UserUpdateManyWithWhereWithoutTenantInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserScalarWhereInputSchema), z.lazy(() => UserScalarWhereInputSchema).array() ]).optional(),
});

export default UserUncheckedUpdateManyWithoutTenantNestedInputSchema;
