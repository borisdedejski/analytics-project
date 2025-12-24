import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { MetricWhereInputSchema } from '../inputTypeSchemas/MetricWhereInputSchema'
import { MetricOrderByWithRelationInputSchema } from '../inputTypeSchemas/MetricOrderByWithRelationInputSchema'
import { MetricWhereUniqueInputSchema } from '../inputTypeSchemas/MetricWhereUniqueInputSchema'
import { MetricScalarFieldEnumSchema } from '../inputTypeSchemas/MetricScalarFieldEnumSchema'

export const MetricFindFirstArgsSchema: z.ZodType<Omit<Prisma.MetricFindFirstArgs, "select" | "include">> = z.object({
  where: MetricWhereInputSchema.optional(), 
  orderBy: z.union([ MetricOrderByWithRelationInputSchema.array(), MetricOrderByWithRelationInputSchema ]).optional(),
  cursor: MetricWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MetricScalarFieldEnumSchema, MetricScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export default MetricFindFirstArgsSchema;
