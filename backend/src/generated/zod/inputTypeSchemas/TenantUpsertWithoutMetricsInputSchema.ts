import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { TenantUpdateWithoutMetricsInputSchema } from './TenantUpdateWithoutMetricsInputSchema';
import { TenantUncheckedUpdateWithoutMetricsInputSchema } from './TenantUncheckedUpdateWithoutMetricsInputSchema';
import { TenantCreateWithoutMetricsInputSchema } from './TenantCreateWithoutMetricsInputSchema';
import { TenantUncheckedCreateWithoutMetricsInputSchema } from './TenantUncheckedCreateWithoutMetricsInputSchema';
import { TenantWhereInputSchema } from './TenantWhereInputSchema';

export const TenantUpsertWithoutMetricsInputSchema: z.ZodType<Prisma.TenantUpsertWithoutMetricsInput> = z.strictObject({
  update: z.union([ z.lazy(() => TenantUpdateWithoutMetricsInputSchema), z.lazy(() => TenantUncheckedUpdateWithoutMetricsInputSchema) ]),
  create: z.union([ z.lazy(() => TenantCreateWithoutMetricsInputSchema), z.lazy(() => TenantUncheckedCreateWithoutMetricsInputSchema) ]),
  where: z.lazy(() => TenantWhereInputSchema).optional(),
});

export default TenantUpsertWithoutMetricsInputSchema;
