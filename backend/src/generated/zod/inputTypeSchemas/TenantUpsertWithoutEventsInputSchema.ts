import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { TenantUpdateWithoutEventsInputSchema } from './TenantUpdateWithoutEventsInputSchema';
import { TenantUncheckedUpdateWithoutEventsInputSchema } from './TenantUncheckedUpdateWithoutEventsInputSchema';
import { TenantCreateWithoutEventsInputSchema } from './TenantCreateWithoutEventsInputSchema';
import { TenantUncheckedCreateWithoutEventsInputSchema } from './TenantUncheckedCreateWithoutEventsInputSchema';
import { TenantWhereInputSchema } from './TenantWhereInputSchema';

export const TenantUpsertWithoutEventsInputSchema: z.ZodType<Prisma.TenantUpsertWithoutEventsInput> = z.strictObject({
  update: z.union([ z.lazy(() => TenantUpdateWithoutEventsInputSchema), z.lazy(() => TenantUncheckedUpdateWithoutEventsInputSchema) ]),
  create: z.union([ z.lazy(() => TenantCreateWithoutEventsInputSchema), z.lazy(() => TenantUncheckedCreateWithoutEventsInputSchema) ]),
  where: z.lazy(() => TenantWhereInputSchema).optional(),
});

export default TenantUpsertWithoutEventsInputSchema;
