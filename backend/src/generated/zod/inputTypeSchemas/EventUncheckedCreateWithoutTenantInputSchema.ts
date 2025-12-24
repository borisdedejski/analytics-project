import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { NullableJsonNullValueInputSchema } from './NullableJsonNullValueInputSchema';
import { InputJsonValueSchema } from './InputJsonValueSchema';

export const EventUncheckedCreateWithoutTenantInputSchema: z.ZodType<Prisma.EventUncheckedCreateWithoutTenantInput> = z.strictObject({
  id: z.string().optional(),
  userId: z.string().optional().nullable(),
  sessionId: z.string(),
  eventType: z.string(),
  timestamp: z.coerce.date().optional(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
});

export default EventUncheckedCreateWithoutTenantInputSchema;
