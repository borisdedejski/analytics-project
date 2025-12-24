import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { MetricWhereInputSchema } from '../inputTypeSchemas/MetricWhereInputSchema'

export const MetricDeleteManyArgsSchema: z.ZodType<Prisma.MetricDeleteManyArgs> = z.object({
  where: MetricWhereInputSchema.optional(), 
}).strict();

export default MetricDeleteManyArgsSchema;
