import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { TenantCreateManyInputSchema } from '../inputTypeSchemas/TenantCreateManyInputSchema'

export const TenantCreateManyArgsSchema: z.ZodType<Prisma.TenantCreateManyArgs> = z.object({
  data: z.union([ TenantCreateManyInputSchema, TenantCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export default TenantCreateManyArgsSchema;
