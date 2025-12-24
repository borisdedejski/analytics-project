import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { MetricWhereUniqueInputSchema } from '../inputTypeSchemas/MetricWhereUniqueInputSchema'

export const MetricFindUniqueArgsSchema: z.ZodType<Omit<Prisma.MetricFindUniqueArgs, "select" | "include">> = z.object({
  where: MetricWhereUniqueInputSchema, 
}).strict();

export default MetricFindUniqueArgsSchema;
