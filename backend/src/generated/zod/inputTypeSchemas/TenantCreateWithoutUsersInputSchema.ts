import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { EventCreateNestedManyWithoutTenantInputSchema } from './EventCreateNestedManyWithoutTenantInputSchema';
import { MetricCreateNestedManyWithoutTenantInputSchema } from './MetricCreateNestedManyWithoutTenantInputSchema';

export const TenantCreateWithoutUsersInputSchema: z.ZodType<Prisma.TenantCreateWithoutUsersInput> = z.strictObject({
  id: z.string().optional(),
  name: z.string(),
  region: z.string(),
  plan: z.string(),
  createdAt: z.coerce.date().optional(),
  events: z.lazy(() => EventCreateNestedManyWithoutTenantInputSchema).optional(),
  metrics: z.lazy(() => MetricCreateNestedManyWithoutTenantInputSchema).optional(),
});

export default TenantCreateWithoutUsersInputSchema;
