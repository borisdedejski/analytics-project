import { z } from 'zod';
import type { Prisma } from '@prisma/client';

export const TenantCountOutputTypeSelectSchema: z.ZodType<Prisma.TenantCountOutputTypeSelect> = z.object({
  users: z.boolean().optional(),
  events: z.boolean().optional(),
  metrics: z.boolean().optional(),
}).strict();

export default TenantCountOutputTypeSelectSchema;
