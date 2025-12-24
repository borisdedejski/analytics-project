import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { UserUncheckedCreateNestedManyWithoutTenantInputSchema } from './UserUncheckedCreateNestedManyWithoutTenantInputSchema';
import { MetricUncheckedCreateNestedManyWithoutTenantInputSchema } from './MetricUncheckedCreateNestedManyWithoutTenantInputSchema';

export const TenantUncheckedCreateWithoutEventsInputSchema: z.ZodType<Prisma.TenantUncheckedCreateWithoutEventsInput> = z.strictObject({
  id: z.string().optional(),
  name: z.string(),
  region: z.string(),
  plan: z.string(),
  createdAt: z.coerce.date().optional(),
  users: z.lazy(() => UserUncheckedCreateNestedManyWithoutTenantInputSchema).optional(),
  metrics: z.lazy(() => MetricUncheckedCreateNestedManyWithoutTenantInputSchema).optional(),
});

export default TenantUncheckedCreateWithoutEventsInputSchema;
