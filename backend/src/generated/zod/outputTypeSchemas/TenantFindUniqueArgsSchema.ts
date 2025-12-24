import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { TenantWhereUniqueInputSchema } from '../inputTypeSchemas/TenantWhereUniqueInputSchema'

export const TenantFindUniqueArgsSchema: z.ZodType<Omit<Prisma.TenantFindUniqueArgs, "select" | "include">> = z.object({
  where: TenantWhereUniqueInputSchema, 
}).strict();

export default TenantFindUniqueArgsSchema;
