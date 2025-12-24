import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { EventScalarWhereInputSchema } from './EventScalarWhereInputSchema';
import { EventUpdateManyMutationInputSchema } from './EventUpdateManyMutationInputSchema';
import { EventUncheckedUpdateManyWithoutTenantInputSchema } from './EventUncheckedUpdateManyWithoutTenantInputSchema';

export const EventUpdateManyWithWhereWithoutTenantInputSchema: z.ZodType<Prisma.EventUpdateManyWithWhereWithoutTenantInput> = z.strictObject({
  where: z.lazy(() => EventScalarWhereInputSchema),
  data: z.union([ z.lazy(() => EventUpdateManyMutationInputSchema), z.lazy(() => EventUncheckedUpdateManyWithoutTenantInputSchema) ]),
});

export default EventUpdateManyWithWhereWithoutTenantInputSchema;
