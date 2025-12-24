import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { EventCreateManyUserInputSchema } from './EventCreateManyUserInputSchema';

export const EventCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.EventCreateManyUserInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => EventCreateManyUserInputSchema), z.lazy(() => EventCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export default EventCreateManyUserInputEnvelopeSchema;
