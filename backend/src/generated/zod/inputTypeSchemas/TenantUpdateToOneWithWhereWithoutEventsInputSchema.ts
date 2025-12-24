import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { TenantWhereInputSchema } from './TenantWhereInputSchema';
import { TenantUpdateWithoutEventsInputSchema } from './TenantUpdateWithoutEventsInputSchema';
import { TenantUncheckedUpdateWithoutEventsInputSchema } from './TenantUncheckedUpdateWithoutEventsInputSchema';

export const TenantUpdateToOneWithWhereWithoutEventsInputSchema: z.ZodType<Prisma.TenantUpdateToOneWithWhereWithoutEventsInput> = z.strictObject({
  where: z.lazy(() => TenantWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => TenantUpdateWithoutEventsInputSchema), z.lazy(() => TenantUncheckedUpdateWithoutEventsInputSchema) ]),
});

export default TenantUpdateToOneWithWhereWithoutEventsInputSchema;
