import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { MetricWhereUniqueInputSchema } from './MetricWhereUniqueInputSchema';
import { MetricCreateWithoutTenantInputSchema } from './MetricCreateWithoutTenantInputSchema';
import { MetricUncheckedCreateWithoutTenantInputSchema } from './MetricUncheckedCreateWithoutTenantInputSchema';

export const MetricCreateOrConnectWithoutTenantInputSchema: z.ZodType<Prisma.MetricCreateOrConnectWithoutTenantInput> = z.strictObject({
  where: z.lazy(() => MetricWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => MetricCreateWithoutTenantInputSchema), z.lazy(() => MetricUncheckedCreateWithoutTenantInputSchema) ]),
});

export default MetricCreateOrConnectWithoutTenantInputSchema;
