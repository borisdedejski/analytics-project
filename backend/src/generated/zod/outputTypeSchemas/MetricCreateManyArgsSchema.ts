import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { MetricCreateManyInputSchema } from '../inputTypeSchemas/MetricCreateManyInputSchema'

export const MetricCreateManyArgsSchema: z.ZodType<Prisma.MetricCreateManyArgs> = z.object({
  data: z.union([ MetricCreateManyInputSchema, MetricCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export default MetricCreateManyArgsSchema;
