import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UserFindManyArgsSchema } from "../outputTypeSchemas/UserFindManyArgsSchema"
import { EventFindManyArgsSchema } from "../outputTypeSchemas/EventFindManyArgsSchema"
import { MetricFindManyArgsSchema } from "../outputTypeSchemas/MetricFindManyArgsSchema"
import { TenantCountOutputTypeArgsSchema } from "../outputTypeSchemas/TenantCountOutputTypeArgsSchema"

export const TenantIncludeSchema: z.ZodType<Prisma.TenantInclude> = z.object({
  users: z.union([z.boolean(),z.lazy(() => UserFindManyArgsSchema)]).optional(),
  events: z.union([z.boolean(),z.lazy(() => EventFindManyArgsSchema)]).optional(),
  metrics: z.union([z.boolean(),z.lazy(() => MetricFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => TenantCountOutputTypeArgsSchema)]).optional(),
}).strict();

export default TenantIncludeSchema;
