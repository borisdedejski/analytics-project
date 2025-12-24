import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { TenantWhereInputSchema } from '../inputTypeSchemas/TenantWhereInputSchema'

export const TenantDeleteManyArgsSchema: z.ZodType<Prisma.TenantDeleteManyArgs> = z.object({
  where: TenantWhereInputSchema.optional(), 
}).strict();

export default TenantDeleteManyArgsSchema;
