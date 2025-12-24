import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { EventWhereUniqueInputSchema } from './EventWhereUniqueInputSchema';
import { EventUpdateWithoutTenantInputSchema } from './EventUpdateWithoutTenantInputSchema';
import { EventUncheckedUpdateWithoutTenantInputSchema } from './EventUncheckedUpdateWithoutTenantInputSchema';

export const EventUpdateWithWhereUniqueWithoutTenantInputSchema: z.ZodType<Prisma.EventUpdateWithWhereUniqueWithoutTenantInput> = z.strictObject({
  where: z.lazy(() => EventWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => EventUpdateWithoutTenantInputSchema), z.lazy(() => EventUncheckedUpdateWithoutTenantInputSchema) ]),
});

export default EventUpdateWithWhereUniqueWithoutTenantInputSchema;
