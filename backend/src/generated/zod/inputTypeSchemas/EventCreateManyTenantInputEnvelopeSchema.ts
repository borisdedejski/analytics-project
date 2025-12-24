import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { EventCreateManyTenantInputSchema } from './EventCreateManyTenantInputSchema';

export const EventCreateManyTenantInputEnvelopeSchema: z.ZodType<Prisma.EventCreateManyTenantInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => EventCreateManyTenantInputSchema), z.lazy(() => EventCreateManyTenantInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export default EventCreateManyTenantInputEnvelopeSchema;
