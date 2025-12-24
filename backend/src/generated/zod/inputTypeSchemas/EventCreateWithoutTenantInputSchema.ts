import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { NullableJsonNullValueInputSchema } from './NullableJsonNullValueInputSchema';
import { InputJsonValueSchema } from './InputJsonValueSchema';
import { UserCreateNestedOneWithoutEventsInputSchema } from './UserCreateNestedOneWithoutEventsInputSchema';

export const EventCreateWithoutTenantInputSchema: z.ZodType<Prisma.EventCreateWithoutTenantInput> = z.strictObject({
  id: z.string().optional(),
  sessionId: z.string(),
  eventType: z.string(),
  timestamp: z.coerce.date().optional(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutEventsInputSchema).optional(),
});

export default EventCreateWithoutTenantInputSchema;
