import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { MetricWhereInputSchema } from '../inputTypeSchemas/MetricWhereInputSchema'
import { MetricOrderByWithRelationInputSchema } from '../inputTypeSchemas/MetricOrderByWithRelationInputSchema'
import { MetricWhereUniqueInputSchema } from '../inputTypeSchemas/MetricWhereUniqueInputSchema'

export const MetricAggregateArgsSchema: z.ZodType<Prisma.MetricAggregateArgs> = z.object({
  where: MetricWhereInputSchema.optional(), 
  orderBy: z.union([ MetricOrderByWithRelationInputSchema.array(), MetricOrderByWithRelationInputSchema ]).optional(),
  cursor: MetricWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export default MetricAggregateArgsSchema;
