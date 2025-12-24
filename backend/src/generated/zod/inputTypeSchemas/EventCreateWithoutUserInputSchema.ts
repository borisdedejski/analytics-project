import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { NullableJsonNullValueInputSchema } from './NullableJsonNullValueInputSchema';
import { InputJsonValueSchema } from './InputJsonValueSchema';
import { TenantCreateNestedOneWithoutEventsInputSchema } from './TenantCreateNestedOneWithoutEventsInputSchema';

export const EventCreateWithoutUserInputSchema: z.ZodType<Prisma.EventCreateWithoutUserInput> = z.strictObject({
  id: z.string().optional(),
  sessionId: z.string(),
  eventType: z.string(),
  timestamp: z.coerce.date().optional(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  tenant: z.lazy(() => TenantCreateNestedOneWithoutEventsInputSchema),
});

export default EventCreateWithoutUserInputSchema;
