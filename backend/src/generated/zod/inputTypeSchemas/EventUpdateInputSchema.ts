import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { StringFieldUpdateOperationsInputSchema } from './StringFieldUpdateOperationsInputSchema';
import { DateTimeFieldUpdateOperationsInputSchema } from './DateTimeFieldUpdateOperationsInputSchema';
import { NullableJsonNullValueInputSchema } from './NullableJsonNullValueInputSchema';
import { InputJsonValueSchema } from './InputJsonValueSchema';
import { TenantUpdateOneRequiredWithoutEventsNestedInputSchema } from './TenantUpdateOneRequiredWithoutEventsNestedInputSchema';
import { UserUpdateOneWithoutEventsNestedInputSchema } from './UserUpdateOneWithoutEventsNestedInputSchema';

export const EventUpdateInputSchema: z.ZodType<Prisma.EventUpdateInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  sessionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  eventType: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  timestamp: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  tenant: z.lazy(() => TenantUpdateOneRequiredWithoutEventsNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneWithoutEventsNestedInputSchema).optional(),
});

export default EventUpdateInputSchema;
