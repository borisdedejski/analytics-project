import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { MetricWhereUniqueInputSchema } from '../inputTypeSchemas/MetricWhereUniqueInputSchema'

export const MetricDeleteArgsSchema: z.ZodType<Omit<Prisma.MetricDeleteArgs, "select" | "include">> = z.object({
  where: MetricWhereUniqueInputSchema, 
}).strict();

export default MetricDeleteArgsSchema;
