import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { TenantCreateNestedOneWithoutMetricsInputSchema } from './TenantCreateNestedOneWithoutMetricsInputSchema';

export const MetricCreateInputSchema: z.ZodType<Prisma.MetricCreateInput> = z.strictObject({
  id: z.string().optional(),
  serviceName: z.string(),
  metricName: z.string(),
  timestamp: z.coerce.date().optional(),
  value: z.number(),
  tenant: z.lazy(() => TenantCreateNestedOneWithoutMetricsInputSchema),
});

export default MetricCreateInputSchema;
