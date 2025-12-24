import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { MetricCreateInputSchema } from '../inputTypeSchemas/MetricCreateInputSchema'
import { MetricUncheckedCreateInputSchema } from '../inputTypeSchemas/MetricUncheckedCreateInputSchema'

export const MetricCreateArgsSchema: z.ZodType<Omit<Prisma.MetricCreateArgs, "select" | "include">> = z.object({
  data: z.union([ MetricCreateInputSchema, MetricUncheckedCreateInputSchema ]),
}).strict();

export default MetricCreateArgsSchema;
