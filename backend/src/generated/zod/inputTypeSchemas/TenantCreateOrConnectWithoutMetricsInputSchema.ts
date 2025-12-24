import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { TenantWhereUniqueInputSchema } from './TenantWhereUniqueInputSchema';
import { TenantCreateWithoutMetricsInputSchema } from './TenantCreateWithoutMetricsInputSchema';
import { TenantUncheckedCreateWithoutMetricsInputSchema } from './TenantUncheckedCreateWithoutMetricsInputSchema';

export const TenantCreateOrConnectWithoutMetricsInputSchema: z.ZodType<Prisma.TenantCreateOrConnectWithoutMetricsInput> = z.strictObject({
  where: z.lazy(() => TenantWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TenantCreateWithoutMetricsInputSchema), z.lazy(() => TenantUncheckedCreateWithoutMetricsInputSchema) ]),
});

export default TenantCreateOrConnectWithoutMetricsInputSchema;
