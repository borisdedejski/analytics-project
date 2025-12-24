import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { TenantCreateWithoutMetricsInputSchema } from './TenantCreateWithoutMetricsInputSchema';
import { TenantUncheckedCreateWithoutMetricsInputSchema } from './TenantUncheckedCreateWithoutMetricsInputSchema';
import { TenantCreateOrConnectWithoutMetricsInputSchema } from './TenantCreateOrConnectWithoutMetricsInputSchema';
import { TenantWhereUniqueInputSchema } from './TenantWhereUniqueInputSchema';

export const TenantCreateNestedOneWithoutMetricsInputSchema: z.ZodType<Prisma.TenantCreateNestedOneWithoutMetricsInput> = z.strictObject({
  create: z.union([ z.lazy(() => TenantCreateWithoutMetricsInputSchema), z.lazy(() => TenantUncheckedCreateWithoutMetricsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TenantCreateOrConnectWithoutMetricsInputSchema).optional(),
  connect: z.lazy(() => TenantWhereUniqueInputSchema).optional(),
});

export default TenantCreateNestedOneWithoutMetricsInputSchema;
