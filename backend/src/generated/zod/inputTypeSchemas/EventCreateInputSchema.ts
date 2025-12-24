import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { NullableJsonNullValueInputSchema } from './NullableJsonNullValueInputSchema';
import { InputJsonValueSchema } from './InputJsonValueSchema';
import { TenantCreateNestedOneWithoutEventsInputSchema } from './TenantCreateNestedOneWithoutEventsInputSchema';
import { UserCreateNestedOneWithoutEventsInputSchema } from './UserCreateNestedOneWithoutEventsInputSchema';

export const EventCreateInputSchema: z.ZodType<Prisma.EventCreateInput> = z.strictObject({
  id: z.string().optional(),
  sessionId: z.string(),
  eventType: z.string(),
  timestamp: z.coerce.date().optional(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  tenant: z.lazy(() => TenantCreateNestedOneWithoutEventsInputSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutEventsInputSchema).optional(),
});

export default EventCreateInputSchema;
