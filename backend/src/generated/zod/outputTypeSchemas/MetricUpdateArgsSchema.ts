import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { MetricUpdateInputSchema } from '../inputTypeSchemas/MetricUpdateInputSchema'
import { MetricUncheckedUpdateInputSchema } from '../inputTypeSchemas/MetricUncheckedUpdateInputSchema'
import { MetricWhereUniqueInputSchema } from '../inputTypeSchemas/MetricWhereUniqueInputSchema'

export const MetricUpdateArgsSchema: z.ZodType<Omit<Prisma.MetricUpdateArgs, "select" | "include">> = z.object({
  data: z.union([ MetricUpdateInputSchema, MetricUncheckedUpdateInputSchema ]),
  where: MetricWhereUniqueInputSchema, 
}).strict();

export default MetricUpdateArgsSchema;
