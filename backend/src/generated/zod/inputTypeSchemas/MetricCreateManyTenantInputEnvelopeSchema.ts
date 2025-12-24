import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { MetricCreateManyTenantInputSchema } from './MetricCreateManyTenantInputSchema';

export const MetricCreateManyTenantInputEnvelopeSchema: z.ZodType<Prisma.MetricCreateManyTenantInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => MetricCreateManyTenantInputSchema), z.lazy(() => MetricCreateManyTenantInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export default MetricCreateManyTenantInputEnvelopeSchema;
