import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { TenantWhereUniqueInputSchema } from '../inputTypeSchemas/TenantWhereUniqueInputSchema'

export const TenantFindUniqueOrThrowArgsSchema: z.ZodType<Omit<Prisma.TenantFindUniqueOrThrowArgs, "select" | "include">> = z.object({
  where: TenantWhereUniqueInputSchema, 
}).strict();

export default TenantFindUniqueOrThrowArgsSchema;
