import type { Prisma } from '@prisma/client';

import { z } from 'zod';

export const MetricUncheckedCreateWithoutTenantInputSchema: z.ZodType<Prisma.MetricUncheckedCreateWithoutTenantInput> = z.strictObject({
  id: z.string().optional(),
  serviceName: z.string(),
  metricName: z.string(),
  timestamp: z.coerce.date().optional(),
  value: z.number(),
});

export default MetricUncheckedCreateWithoutTenantInputSchema;
