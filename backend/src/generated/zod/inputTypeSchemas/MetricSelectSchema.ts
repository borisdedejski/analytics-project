import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { TenantArgsSchema } from "../outputTypeSchemas/TenantArgsSchema"

export const MetricSelectSchema: z.ZodType<Prisma.MetricSelect> = z.object({
  id: z.boolean().optional(),
  tenantId: z.boolean().optional(),
  serviceName: z.boolean().optional(),
  metricName: z.boolean().optional(),
  timestamp: z.boolean().optional(),
  value: z.boolean().optional(),
  tenant: z.union([z.boolean(),z.lazy(() => TenantArgsSchema)]).optional(),
}).strict()

export default MetricSelectSchema;
