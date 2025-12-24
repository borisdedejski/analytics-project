import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { EventUncheckedCreateNestedManyWithoutTenantInputSchema } from './EventUncheckedCreateNestedManyWithoutTenantInputSchema';
import { MetricUncheckedCreateNestedManyWithoutTenantInputSchema } from './MetricUncheckedCreateNestedManyWithoutTenantInputSchema';

export const TenantUncheckedCreateWithoutUsersInputSchema: z.ZodType<Prisma.TenantUncheckedCreateWithoutUsersInput> = z.strictObject({
  id: z.string().optional(),
  name: z.string(),
  region: z.string(),
  plan: z.string(),
  createdAt: z.coerce.date().optional(),
  events: z.lazy(() => EventUncheckedCreateNestedManyWithoutTenantInputSchema).optional(),
  metrics: z.lazy(() => MetricUncheckedCreateNestedManyWithoutTenantInputSchema).optional(),
});

export default TenantUncheckedCreateWithoutUsersInputSchema;
