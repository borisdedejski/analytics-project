import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { TenantArgsSchema } from "../outputTypeSchemas/TenantArgsSchema"
import { UserArgsSchema } from "../outputTypeSchemas/UserArgsSchema"

export const EventIncludeSchema: z.ZodType<Prisma.EventInclude> = z.object({
  tenant: z.union([z.boolean(),z.lazy(() => TenantArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict();

export default EventIncludeSchema;
