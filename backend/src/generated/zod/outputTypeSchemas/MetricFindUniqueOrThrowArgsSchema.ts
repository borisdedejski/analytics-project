import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { MetricWhereUniqueInputSchema } from '../inputTypeSchemas/MetricWhereUniqueInputSchema'

export const MetricFindUniqueOrThrowArgsSchema: z.ZodType<Omit<Prisma.MetricFindUniqueOrThrowArgs, "select" | "include">> = z.object({
  where: MetricWhereUniqueInputSchema, 
}).strict();

export default MetricFindUniqueOrThrowArgsSchema;
