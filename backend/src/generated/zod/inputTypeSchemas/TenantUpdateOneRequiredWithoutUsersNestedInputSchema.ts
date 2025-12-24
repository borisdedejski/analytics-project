import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { TenantCreateWithoutUsersInputSchema } from './TenantCreateWithoutUsersInputSchema';
import { TenantUncheckedCreateWithoutUsersInputSchema } from './TenantUncheckedCreateWithoutUsersInputSchema';
import { TenantCreateOrConnectWithoutUsersInputSchema } from './TenantCreateOrConnectWithoutUsersInputSchema';
import { TenantUpsertWithoutUsersInputSchema } from './TenantUpsertWithoutUsersInputSchema';
import { TenantWhereUniqueInputSchema } from './TenantWhereUniqueInputSchema';
import { TenantUpdateToOneWithWhereWithoutUsersInputSchema } from './TenantUpdateToOneWithWhereWithoutUsersInputSchema';
import { TenantUpdateWithoutUsersInputSchema } from './TenantUpdateWithoutUsersInputSchema';
import { TenantUncheckedUpdateWithoutUsersInputSchema } from './TenantUncheckedUpdateWithoutUsersInputSchema';

export const TenantUpdateOneRequiredWithoutUsersNestedInputSchema: z.ZodType<Prisma.TenantUpdateOneRequiredWithoutUsersNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => TenantCreateWithoutUsersInputSchema), z.lazy(() => TenantUncheckedCreateWithoutUsersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TenantCreateOrConnectWithoutUsersInputSchema).optional(),
  upsert: z.lazy(() => TenantUpsertWithoutUsersInputSchema).optional(),
  connect: z.lazy(() => TenantWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => TenantUpdateToOneWithWhereWithoutUsersInputSchema), z.lazy(() => TenantUpdateWithoutUsersInputSchema), z.lazy(() => TenantUncheckedUpdateWithoutUsersInputSchema) ]).optional(),
});

export default TenantUpdateOneRequiredWithoutUsersNestedInputSchema;
