import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { TenantWhereInputSchema } from '../inputTypeSchemas/TenantWhereInputSchema'
import { TenantOrderByWithAggregationInputSchema } from '../inputTypeSchemas/TenantOrderByWithAggregationInputSchema'
import { TenantScalarFieldEnumSchema } from '../inputTypeSchemas/TenantScalarFieldEnumSchema'
import { TenantScalarWhereWithAggregatesInputSchema } from '../inputTypeSchemas/TenantScalarWhereWithAggregatesInputSchema'

export const TenantGroupByArgsSchema: z.ZodType<Prisma.TenantGroupByArgs> = z.object({
  where: TenantWhereInputSchema.optional(), 
  orderBy: z.union([ TenantOrderByWithAggregationInputSchema.array(), TenantOrderByWithAggregationInputSchema ]).optional(),
  by: TenantScalarFieldEnumSchema.array(), 
  having: TenantScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export default TenantGroupByArgsSchema;
