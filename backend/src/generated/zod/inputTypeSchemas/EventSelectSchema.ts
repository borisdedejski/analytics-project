import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { TenantArgsSchema } from "../outputTypeSchemas/TenantArgsSchema"
import { UserArgsSchema } from "../outputTypeSchemas/UserArgsSchema"

export const EventSelectSchema: z.ZodType<Prisma.EventSelect> = z.object({
  id: z.boolean().optional(),
  tenantId: z.boolean().optional(),
  userId: z.boolean().optional(),
  sessionId: z.boolean().optional(),
  eventType: z.boolean().optional(),
  timestamp: z.boolean().optional(),
  metadata: z.boolean().optional(),
  tenant: z.union([z.boolean(),z.lazy(() => TenantArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export default EventSelectSchema;
