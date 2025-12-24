import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { EventWhereUniqueInputSchema } from './EventWhereUniqueInputSchema';
import { EventUpdateWithoutTenantInputSchema } from './EventUpdateWithoutTenantInputSchema';
import { EventUncheckedUpdateWithoutTenantInputSchema } from './EventUncheckedUpdateWithoutTenantInputSchema';
import { EventCreateWithoutTenantInputSchema } from './EventCreateWithoutTenantInputSchema';
import { EventUncheckedCreateWithoutTenantInputSchema } from './EventUncheckedCreateWithoutTenantInputSchema';

export const EventUpsertWithWhereUniqueWithoutTenantInputSchema: z.ZodType<Prisma.EventUpsertWithWhereUniqueWithoutTenantInput> = z.strictObject({
  where: z.lazy(() => EventWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => EventUpdateWithoutTenantInputSchema), z.lazy(() => EventUncheckedUpdateWithoutTenantInputSchema) ]),
  create: z.union([ z.lazy(() => EventCreateWithoutTenantInputSchema), z.lazy(() => EventUncheckedCreateWithoutTenantInputSchema) ]),
});

export default EventUpsertWithWhereUniqueWithoutTenantInputSchema;
