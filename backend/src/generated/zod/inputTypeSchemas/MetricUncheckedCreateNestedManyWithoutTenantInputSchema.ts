import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { MetricCreateWithoutTenantInputSchema } from './MetricCreateWithoutTenantInputSchema';
import { MetricUncheckedCreateWithoutTenantInputSchema } from './MetricUncheckedCreateWithoutTenantInputSchema';
import { MetricCreateOrConnectWithoutTenantInputSchema } from './MetricCreateOrConnectWithoutTenantInputSchema';
import { MetricCreateManyTenantInputEnvelopeSchema } from './MetricCreateManyTenantInputEnvelopeSchema';
import { MetricWhereUniqueInputSchema } from './MetricWhereUniqueInputSchema';

export const MetricUncheckedCreateNestedManyWithoutTenantInputSchema: z.ZodType<Prisma.MetricUncheckedCreateNestedManyWithoutTenantInput> = z.strictObject({
  create: z.union([ z.lazy(() => MetricCreateWithoutTenantInputSchema), z.lazy(() => MetricCreateWithoutTenantInputSchema).array(), z.lazy(() => MetricUncheckedCreateWithoutTenantInputSchema), z.lazy(() => MetricUncheckedCreateWithoutTenantInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MetricCreateOrConnectWithoutTenantInputSchema), z.lazy(() => MetricCreateOrConnectWithoutTenantInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MetricCreateManyTenantInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => MetricWhereUniqueInputSchema), z.lazy(() => MetricWhereUniqueInputSchema).array() ]).optional(),
});

export default MetricUncheckedCreateNestedManyWithoutTenantInputSchema;
