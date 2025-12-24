import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { MetricWhereUniqueInputSchema } from './MetricWhereUniqueInputSchema';
import { MetricUpdateWithoutTenantInputSchema } from './MetricUpdateWithoutTenantInputSchema';
import { MetricUncheckedUpdateWithoutTenantInputSchema } from './MetricUncheckedUpdateWithoutTenantInputSchema';

export const MetricUpdateWithWhereUniqueWithoutTenantInputSchema: z.ZodType<Prisma.MetricUpdateWithWhereUniqueWithoutTenantInput> = z.strictObject({
  where: z.lazy(() => MetricWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => MetricUpdateWithoutTenantInputSchema), z.lazy(() => MetricUncheckedUpdateWithoutTenantInputSchema) ]),
});

export default MetricUpdateWithWhereUniqueWithoutTenantInputSchema;
