import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { UserCreateNestedManyWithoutTenantInputSchema } from './UserCreateNestedManyWithoutTenantInputSchema';
import { MetricCreateNestedManyWithoutTenantInputSchema } from './MetricCreateNestedManyWithoutTenantInputSchema';

export const TenantCreateWithoutEventsInputSchema: z.ZodType<Prisma.TenantCreateWithoutEventsInput> = z.strictObject({
  id: z.string().optional(),
  name: z.string(),
  region: z.string(),
  plan: z.string(),
  createdAt: z.coerce.date().optional(),
  users: z.lazy(() => UserCreateNestedManyWithoutTenantInputSchema).optional(),
  metrics: z.lazy(() => MetricCreateNestedManyWithoutTenantInputSchema).optional(),
});

export default TenantCreateWithoutEventsInputSchema;
