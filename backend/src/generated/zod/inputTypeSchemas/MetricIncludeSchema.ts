import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { TenantArgsSchema } from "../outputTypeSchemas/TenantArgsSchema"

export const MetricIncludeSchema: z.ZodType<Prisma.MetricInclude> = z.object({
  tenant: z.union([z.boolean(),z.lazy(() => TenantArgsSchema)]).optional(),
}).strict();

export default MetricIncludeSchema;
