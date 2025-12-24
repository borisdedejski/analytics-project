import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { StringFieldUpdateOperationsInputSchema } from './StringFieldUpdateOperationsInputSchema';
import { DateTimeFieldUpdateOperationsInputSchema } from './DateTimeFieldUpdateOperationsInputSchema';
import { UserUpdateManyWithoutTenantNestedInputSchema } from './UserUpdateManyWithoutTenantNestedInputSchema';
import { EventUpdateManyWithoutTenantNestedInputSchema } from './EventUpdateManyWithoutTenantNestedInputSchema';

export const TenantUpdateWithoutMetricsInputSchema: z.ZodType<Prisma.TenantUpdateWithoutMetricsInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  region: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  plan: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  users: z.lazy(() => UserUpdateManyWithoutTenantNestedInputSchema).optional(),
  events: z.lazy(() => EventUpdateManyWithoutTenantNestedInputSchema).optional(),
});

export default TenantUpdateWithoutMetricsInputSchema;
