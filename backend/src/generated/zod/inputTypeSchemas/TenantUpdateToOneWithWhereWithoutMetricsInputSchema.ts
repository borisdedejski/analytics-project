import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { TenantWhereInputSchema } from './TenantWhereInputSchema';
import { TenantUpdateWithoutMetricsInputSchema } from './TenantUpdateWithoutMetricsInputSchema';
import { TenantUncheckedUpdateWithoutMetricsInputSchema } from './TenantUncheckedUpdateWithoutMetricsInputSchema';

export const TenantUpdateToOneWithWhereWithoutMetricsInputSchema: z.ZodType<Prisma.TenantUpdateToOneWithWhereWithoutMetricsInput> = z.strictObject({
  where: z.lazy(() => TenantWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => TenantUpdateWithoutMetricsInputSchema), z.lazy(() => TenantUncheckedUpdateWithoutMetricsInputSchema) ]),
});

export default TenantUpdateToOneWithWhereWithoutMetricsInputSchema;
