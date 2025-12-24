import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { MetricCreateWithoutTenantInputSchema } from './MetricCreateWithoutTenantInputSchema';
import { MetricUncheckedCreateWithoutTenantInputSchema } from './MetricUncheckedCreateWithoutTenantInputSchema';
import { MetricCreateOrConnectWithoutTenantInputSchema } from './MetricCreateOrConnectWithoutTenantInputSchema';
import { MetricUpsertWithWhereUniqueWithoutTenantInputSchema } from './MetricUpsertWithWhereUniqueWithoutTenantInputSchema';
import { MetricCreateManyTenantInputEnvelopeSchema } from './MetricCreateManyTenantInputEnvelopeSchema';
import { MetricWhereUniqueInputSchema } from './MetricWhereUniqueInputSchema';
import { MetricUpdateWithWhereUniqueWithoutTenantInputSchema } from './MetricUpdateWithWhereUniqueWithoutTenantInputSchema';
import { MetricUpdateManyWithWhereWithoutTenantInputSchema } from './MetricUpdateManyWithWhereWithoutTenantInputSchema';
import { MetricScalarWhereInputSchema } from './MetricScalarWhereInputSchema';

export const MetricUpdateManyWithoutTenantNestedInputSchema: z.ZodType<Prisma.MetricUpdateManyWithoutTenantNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => MetricCreateWithoutTenantInputSchema), z.lazy(() => MetricCreateWithoutTenantInputSchema).array(), z.lazy(() => MetricUncheckedCreateWithoutTenantInputSchema), z.lazy(() => MetricUncheckedCreateWithoutTenantInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MetricCreateOrConnectWithoutTenantInputSchema), z.lazy(() => MetricCreateOrConnectWithoutTenantInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => MetricUpsertWithWhereUniqueWithoutTenantInputSchema), z.lazy(() => MetricUpsertWithWhereUniqueWithoutTenantInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MetricCreateManyTenantInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => MetricWhereUniqueInputSchema), z.lazy(() => MetricWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => MetricWhereUniqueInputSchema), z.lazy(() => MetricWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => MetricWhereUniqueInputSchema), z.lazy(() => MetricWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => MetricWhereUniqueInputSchema), z.lazy(() => MetricWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => MetricUpdateWithWhereUniqueWithoutTenantInputSchema), z.lazy(() => MetricUpdateWithWhereUniqueWithoutTenantInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => MetricUpdateManyWithWhereWithoutTenantInputSchema), z.lazy(() => MetricUpdateManyWithWhereWithoutTenantInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => MetricScalarWhereInputSchema), z.lazy(() => MetricScalarWhereInputSchema).array() ]).optional(),
});

export default MetricUpdateManyWithoutTenantNestedInputSchema;
