import type { Prisma } from '@prisma/client';

import { z } from 'zod';

export const MetricUncheckedCreateInputSchema: z.ZodType<Prisma.MetricUncheckedCreateInput> = z.strictObject({
  id: z.string().optional(),
  tenantId: z.string(),
  serviceName: z.string(),
  metricName: z.string(),
  timestamp: z.coerce.date().optional(),
  value: z.number(),
});

export default MetricUncheckedCreateInputSchema;
