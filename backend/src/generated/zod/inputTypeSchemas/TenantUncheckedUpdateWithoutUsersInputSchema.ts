import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { StringFieldUpdateOperationsInputSchema } from './StringFieldUpdateOperationsInputSchema';
import { DateTimeFieldUpdateOperationsInputSchema } from './DateTimeFieldUpdateOperationsInputSchema';
import { EventUncheckedUpdateManyWithoutTenantNestedInputSchema } from './EventUncheckedUpdateManyWithoutTenantNestedInputSchema';
import { MetricUncheckedUpdateManyWithoutTenantNestedInputSchema } from './MetricUncheckedUpdateManyWithoutTenantNestedInputSchema';

export const TenantUncheckedUpdateWithoutUsersInputSchema: z.ZodType<Prisma.TenantUncheckedUpdateWithoutUsersInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  region: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  plan: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  events: z.lazy(() => EventUncheckedUpdateManyWithoutTenantNestedInputSchema).optional(),
  metrics: z.lazy(() => MetricUncheckedUpdateManyWithoutTenantNestedInputSchema).optional(),
});

export default TenantUncheckedUpdateWithoutUsersInputSchema;
