import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { TenantWhereUniqueInputSchema } from '../inputTypeSchemas/TenantWhereUniqueInputSchema'

export const TenantDeleteArgsSchema: z.ZodType<Omit<Prisma.TenantDeleteArgs, "select" | "include">> = z.object({
  where: TenantWhereUniqueInputSchema, 
}).strict();

export default TenantDeleteArgsSchema;
