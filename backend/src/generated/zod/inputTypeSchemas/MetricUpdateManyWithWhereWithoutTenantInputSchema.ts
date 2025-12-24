import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { MetricScalarWhereInputSchema } from './MetricScalarWhereInputSchema';
import { MetricUpdateManyMutationInputSchema } from './MetricUpdateManyMutationInputSchema';
import { MetricUncheckedUpdateManyWithoutTenantInputSchema } from './MetricUncheckedUpdateManyWithoutTenantInputSchema';

export const MetricUpdateManyWithWhereWithoutTenantInputSchema: z.ZodType<Prisma.MetricUpdateManyWithWhereWithoutTenantInput> = z.strictObject({
  where: z.lazy(() => MetricScalarWhereInputSchema),
  data: z.union([ z.lazy(() => MetricUpdateManyMutationInputSchema), z.lazy(() => MetricUncheckedUpdateManyWithoutTenantInputSchema) ]),
});

export default MetricUpdateManyWithWhereWithoutTenantInputSchema;
