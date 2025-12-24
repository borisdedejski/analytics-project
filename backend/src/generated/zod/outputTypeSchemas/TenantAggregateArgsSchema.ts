import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { TenantWhereInputSchema } from '../inputTypeSchemas/TenantWhereInputSchema'
import { TenantOrderByWithRelationInputSchema } from '../inputTypeSchemas/TenantOrderByWithRelationInputSchema'
import { TenantWhereUniqueInputSchema } from '../inputTypeSchemas/TenantWhereUniqueInputSchema'

export const TenantAggregateArgsSchema: z.ZodType<Prisma.TenantAggregateArgs> = z.object({
  where: TenantWhereInputSchema.optional(), 
  orderBy: z.union([ TenantOrderByWithRelationInputSchema.array(), TenantOrderByWithRelationInputSchema ]).optional(),
  cursor: TenantWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export default TenantAggregateArgsSchema;
