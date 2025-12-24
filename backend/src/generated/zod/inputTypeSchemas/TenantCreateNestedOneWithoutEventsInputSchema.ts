import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { TenantCreateWithoutEventsInputSchema } from './TenantCreateWithoutEventsInputSchema';
import { TenantUncheckedCreateWithoutEventsInputSchema } from './TenantUncheckedCreateWithoutEventsInputSchema';
import { TenantCreateOrConnectWithoutEventsInputSchema } from './TenantCreateOrConnectWithoutEventsInputSchema';
import { TenantWhereUniqueInputSchema } from './TenantWhereUniqueInputSchema';

export const TenantCreateNestedOneWithoutEventsInputSchema: z.ZodType<Prisma.TenantCreateNestedOneWithoutEventsInput> = z.strictObject({
  create: z.union([ z.lazy(() => TenantCreateWithoutEventsInputSchema), z.lazy(() => TenantUncheckedCreateWithoutEventsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TenantCreateOrConnectWithoutEventsInputSchema).optional(),
  connect: z.lazy(() => TenantWhereUniqueInputSchema).optional(),
});

export default TenantCreateNestedOneWithoutEventsInputSchema;
