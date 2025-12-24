import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { TenantCreateWithoutMetricsInputSchema } from './TenantCreateWithoutMetricsInputSchema';
import { TenantUncheckedCreateWithoutMetricsInputSchema } from './TenantUncheckedCreateWithoutMetricsInputSchema';
import { TenantCreateOrConnectWithoutMetricsInputSchema } from './TenantCreateOrConnectWithoutMetricsInputSchema';
import { TenantUpsertWithoutMetricsInputSchema } from './TenantUpsertWithoutMetricsInputSchema';
import { TenantWhereUniqueInputSchema } from './TenantWhereUniqueInputSchema';
import { TenantUpdateToOneWithWhereWithoutMetricsInputSchema } from './TenantUpdateToOneWithWhereWithoutMetricsInputSchema';
import { TenantUpdateWithoutMetricsInputSchema } from './TenantUpdateWithoutMetricsInputSchema';
import { TenantUncheckedUpdateWithoutMetricsInputSchema } from './TenantUncheckedUpdateWithoutMetricsInputSchema';

export const TenantUpdateOneRequiredWithoutMetricsNestedInputSchema: z.ZodType<Prisma.TenantUpdateOneRequiredWithoutMetricsNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => TenantCreateWithoutMetricsInputSchema), z.lazy(() => TenantUncheckedCreateWithoutMetricsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TenantCreateOrConnectWithoutMetricsInputSchema).optional(),
  upsert: z.lazy(() => TenantUpsertWithoutMetricsInputSchema).optional(),
  connect: z.lazy(() => TenantWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => TenantUpdateToOneWithWhereWithoutMetricsInputSchema), z.lazy(() => TenantUpdateWithoutMetricsInputSchema), z.lazy(() => TenantUncheckedUpdateWithoutMetricsInputSchema) ]).optional(),
});

export default TenantUpdateOneRequiredWithoutMetricsNestedInputSchema;
