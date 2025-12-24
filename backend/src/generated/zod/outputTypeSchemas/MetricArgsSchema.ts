import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { MetricSelectSchema } from '../inputTypeSchemas/MetricSelectSchema';
import { MetricIncludeSchema } from '../inputTypeSchemas/MetricIncludeSchema';

export const MetricArgsSchema: z.ZodType<Prisma.MetricDefaultArgs> = z.object({
  select: z.lazy(() => MetricSelectSchema).optional(),
  include: z.lazy(() => MetricIncludeSchema).optional(),
}).strict();

export default MetricArgsSchema;
