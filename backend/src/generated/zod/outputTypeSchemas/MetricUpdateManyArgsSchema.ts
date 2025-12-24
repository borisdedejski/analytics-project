import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { MetricUpdateManyMutationInputSchema } from '../inputTypeSchemas/MetricUpdateManyMutationInputSchema'
import { MetricUncheckedUpdateManyInputSchema } from '../inputTypeSchemas/MetricUncheckedUpdateManyInputSchema'
import { MetricWhereInputSchema } from '../inputTypeSchemas/MetricWhereInputSchema'

export const MetricUpdateManyArgsSchema: z.ZodType<Prisma.MetricUpdateManyArgs> = z.object({
  data: z.union([ MetricUpdateManyMutationInputSchema, MetricUncheckedUpdateManyInputSchema ]),
  where: MetricWhereInputSchema.optional(), 
}).strict();

export default MetricUpdateManyArgsSchema;
