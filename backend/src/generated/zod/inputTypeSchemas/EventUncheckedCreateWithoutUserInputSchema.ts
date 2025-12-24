import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { NullableJsonNullValueInputSchema } from './NullableJsonNullValueInputSchema';
import { InputJsonValueSchema } from './InputJsonValueSchema';

export const EventUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.EventUncheckedCreateWithoutUserInput> = z.strictObject({
  id: z.string().optional(),
  tenantId: z.string(),
  sessionId: z.string(),
  eventType: z.string(),
  timestamp: z.coerce.date().optional(),
  metadata: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
});

export default EventUncheckedCreateWithoutUserInputSchema;
