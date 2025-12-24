import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { MetricWhereUniqueInputSchema } from './MetricWhereUniqueInputSchema';
import { MetricUpdateWithoutTenantInputSchema } from './MetricUpdateWithoutTenantInputSchema';
import { MetricUncheckedUpdateWithoutTenantInputSchema } from './MetricUncheckedUpdateWithoutTenantInputSchema';
import { MetricCreateWithoutTenantInputSchema } from './MetricCreateWithoutTenantInputSchema';
import { MetricUncheckedCreateWithoutTenantInputSchema } from './MetricUncheckedCreateWithoutTenantInputSchema';

export const MetricUpsertWithWhereUniqueWithoutTenantInputSchema: z.ZodType<Prisma.MetricUpsertWithWhereUniqueWithoutTenantInput> = z.strictObject({
  where: z.lazy(() => MetricWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => MetricUpdateWithoutTenantInputSchema), z.lazy(() => MetricUncheckedUpdateWithoutTenantInputSchema) ]),
  create: z.union([ z.lazy(() => MetricCreateWithoutTenantInputSchema), z.lazy(() => MetricUncheckedCreateWithoutTenantInputSchema) ]),
});

export default MetricUpsertWithWhereUniqueWithoutTenantInputSchema;
