import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { MetricWhereUniqueInputSchema } from '../inputTypeSchemas/MetricWhereUniqueInputSchema'
import { MetricCreateInputSchema } from '../inputTypeSchemas/MetricCreateInputSchema'
import { MetricUncheckedCreateInputSchema } from '../inputTypeSchemas/MetricUncheckedCreateInputSchema'
import { MetricUpdateInputSchema } from '../inputTypeSchemas/MetricUpdateInputSchema'
import { MetricUncheckedUpdateInputSchema } from '../inputTypeSchemas/MetricUncheckedUpdateInputSchema'

export const MetricUpsertArgsSchema: z.ZodType<Omit<Prisma.MetricUpsertArgs, "select" | "include">> = z.object({
  where: MetricWhereUniqueInputSchema, 
  create: z.union([ MetricCreateInputSchema, MetricUncheckedCreateInputSchema ]),
  update: z.union([ MetricUpdateInputSchema, MetricUncheckedUpdateInputSchema ]),
}).strict();

export default MetricUpsertArgsSchema;
