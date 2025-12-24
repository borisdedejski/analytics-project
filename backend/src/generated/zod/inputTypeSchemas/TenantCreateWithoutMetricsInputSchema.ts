import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { UserCreateNestedManyWithoutTenantInputSchema } from './UserCreateNestedManyWithoutTenantInputSchema';
import { EventCreateNestedManyWithoutTenantInputSchema } from './EventCreateNestedManyWithoutTenantInputSchema';

export const TenantCreateWithoutMetricsInputSchema: z.ZodType<Prisma.TenantCreateWithoutMetricsInput> = z.strictObject({
  id: z.string().optional(),
  name: z.string(),
  region: z.string(),
  plan: z.string(),
  createdAt: z.coerce.date().optional(),
  users: z.lazy(() => UserCreateNestedManyWithoutTenantInputSchema).optional(),
  events: z.lazy(() => EventCreateNestedManyWithoutTenantInputSchema).optional(),
});

export default TenantCreateWithoutMetricsInputSchema;
