import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { UserUncheckedCreateNestedManyWithoutTenantInputSchema } from './UserUncheckedCreateNestedManyWithoutTenantInputSchema';
import { EventUncheckedCreateNestedManyWithoutTenantInputSchema } from './EventUncheckedCreateNestedManyWithoutTenantInputSchema';
import { MetricUncheckedCreateNestedManyWithoutTenantInputSchema } from './MetricUncheckedCreateNestedManyWithoutTenantInputSchema';

export const TenantUncheckedCreateInputSchema: z.ZodType<Prisma.TenantUncheckedCreateInput> = z.strictObject({
  id: z.string().optional(),
  name: z.string(),
  region: z.string(),
  plan: z.string(),
  createdAt: z.coerce.date().optional(),
  users: z.lazy(() => UserUncheckedCreateNestedManyWithoutTenantInputSchema).optional(),
  events: z.lazy(() => EventUncheckedCreateNestedManyWithoutTenantInputSchema).optional(),
  metrics: z.lazy(() => MetricUncheckedCreateNestedManyWithoutTenantInputSchema).optional(),
});

export default TenantUncheckedCreateInputSchema;
