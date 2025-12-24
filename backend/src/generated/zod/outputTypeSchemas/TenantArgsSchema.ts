import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { TenantSelectSchema } from '../inputTypeSchemas/TenantSelectSchema';
import { TenantIncludeSchema } from '../inputTypeSchemas/TenantIncludeSchema';

export const TenantArgsSchema: z.ZodType<Prisma.TenantDefaultArgs> = z.object({
  select: z.lazy(() => TenantSelectSchema).optional(),
  include: z.lazy(() => TenantIncludeSchema).optional(),
}).strict();

export default TenantArgsSchema;
