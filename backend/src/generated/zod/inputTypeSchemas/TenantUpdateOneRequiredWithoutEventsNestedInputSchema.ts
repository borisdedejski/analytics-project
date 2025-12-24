import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { TenantCreateWithoutEventsInputSchema } from './TenantCreateWithoutEventsInputSchema';
import { TenantUncheckedCreateWithoutEventsInputSchema } from './TenantUncheckedCreateWithoutEventsInputSchema';
import { TenantCreateOrConnectWithoutEventsInputSchema } from './TenantCreateOrConnectWithoutEventsInputSchema';
import { TenantUpsertWithoutEventsInputSchema } from './TenantUpsertWithoutEventsInputSchema';
import { TenantWhereUniqueInputSchema } from './TenantWhereUniqueInputSchema';
import { TenantUpdateToOneWithWhereWithoutEventsInputSchema } from './TenantUpdateToOneWithWhereWithoutEventsInputSchema';
import { TenantUpdateWithoutEventsInputSchema } from './TenantUpdateWithoutEventsInputSchema';
import { TenantUncheckedUpdateWithoutEventsInputSchema } from './TenantUncheckedUpdateWithoutEventsInputSchema';

export const TenantUpdateOneRequiredWithoutEventsNestedInputSchema: z.ZodType<Prisma.TenantUpdateOneRequiredWithoutEventsNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => TenantCreateWithoutEventsInputSchema), z.lazy(() => TenantUncheckedCreateWithoutEventsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TenantCreateOrConnectWithoutEventsInputSchema).optional(),
  upsert: z.lazy(() => TenantUpsertWithoutEventsInputSchema).optional(),
  connect: z.lazy(() => TenantWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => TenantUpdateToOneWithWhereWithoutEventsInputSchema), z.lazy(() => TenantUpdateWithoutEventsInputSchema), z.lazy(() => TenantUncheckedUpdateWithoutEventsInputSchema) ]).optional(),
});

export default TenantUpdateOneRequiredWithoutEventsNestedInputSchema;
