import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { TenantWhereInputSchema } from '../inputTypeSchemas/TenantWhereInputSchema'
import { TenantOrderByWithRelationInputSchema } from '../inputTypeSchemas/TenantOrderByWithRelationInputSchema'
import { TenantWhereUniqueInputSchema } from '../inputTypeSchemas/TenantWhereUniqueInputSchema'
import { TenantScalarFieldEnumSchema } from '../inputTypeSchemas/TenantScalarFieldEnumSchema'

export const TenantFindFirstArgsSchema: z.ZodType<Omit<Prisma.TenantFindFirstArgs, "select" | "include">> = z.object({
  where: TenantWhereInputSchema.optional(), 
  orderBy: z.union([ TenantOrderByWithRelationInputSchema.array(), TenantOrderByWithRelationInputSchema ]).optional(),
  cursor: TenantWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TenantScalarFieldEnumSchema, TenantScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export default TenantFindFirstArgsSchema;
