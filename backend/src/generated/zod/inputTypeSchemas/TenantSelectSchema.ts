import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UserFindManyArgsSchema } from "../outputTypeSchemas/UserFindManyArgsSchema"
import { EventFindManyArgsSchema } from "../outputTypeSchemas/EventFindManyArgsSchema"
import { MetricFindManyArgsSchema } from "../outputTypeSchemas/MetricFindManyArgsSchema"
import { TenantCountOutputTypeArgsSchema } from "../outputTypeSchemas/TenantCountOutputTypeArgsSchema"

export const TenantSelectSchema: z.ZodType<Prisma.TenantSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  region: z.boolean().optional(),
  plan: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  users: z.union([z.boolean(),z.lazy(() => UserFindManyArgsSchema)]).optional(),
  events: z.union([z.boolean(),z.lazy(() => EventFindManyArgsSchema)]).optional(),
  metrics: z.union([z.boolean(),z.lazy(() => MetricFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => TenantCountOutputTypeArgsSchema)]).optional(),
}).strict()

export default TenantSelectSchema;
