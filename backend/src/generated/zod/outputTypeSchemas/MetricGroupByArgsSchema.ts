import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { MetricWhereInputSchema } from '../inputTypeSchemas/MetricWhereInputSchema'
import { MetricOrderByWithAggregationInputSchema } from '../inputTypeSchemas/MetricOrderByWithAggregationInputSchema'
import { MetricScalarFieldEnumSchema } from '../inputTypeSchemas/MetricScalarFieldEnumSchema'
import { MetricScalarWhereWithAggregatesInputSchema } from '../inputTypeSchemas/MetricScalarWhereWithAggregatesInputSchema'

export const MetricGroupByArgsSchema: z.ZodType<Prisma.MetricGroupByArgs> = z.object({
  where: MetricWhereInputSchema.optional(), 
  orderBy: z.union([ MetricOrderByWithAggregationInputSchema.array(), MetricOrderByWithAggregationInputSchema ]).optional(),
  by: MetricScalarFieldEnumSchema.array(), 
  having: MetricScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export default MetricGroupByArgsSchema;
