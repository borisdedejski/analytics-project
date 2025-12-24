import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { TenantWhereUniqueInputSchema } from './TenantWhereUniqueInputSchema';
import { TenantCreateWithoutEventsInputSchema } from './TenantCreateWithoutEventsInputSchema';
import { TenantUncheckedCreateWithoutEventsInputSchema } from './TenantUncheckedCreateWithoutEventsInputSchema';

export const TenantCreateOrConnectWithoutEventsInputSchema: z.ZodType<Prisma.TenantCreateOrConnectWithoutEventsInput> = z.strictObject({
  where: z.lazy(() => TenantWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TenantCreateWithoutEventsInputSchema), z.lazy(() => TenantUncheckedCreateWithoutEventsInputSchema) ]),
});

export default TenantCreateOrConnectWithoutEventsInputSchema;
