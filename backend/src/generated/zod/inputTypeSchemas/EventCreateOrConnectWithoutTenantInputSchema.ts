import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { EventWhereUniqueInputSchema } from './EventWhereUniqueInputSchema';
import { EventCreateWithoutTenantInputSchema } from './EventCreateWithoutTenantInputSchema';
import { EventUncheckedCreateWithoutTenantInputSchema } from './EventUncheckedCreateWithoutTenantInputSchema';

export const EventCreateOrConnectWithoutTenantInputSchema: z.ZodType<Prisma.EventCreateOrConnectWithoutTenantInput> = z.strictObject({
  where: z.lazy(() => EventWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => EventCreateWithoutTenantInputSchema), z.lazy(() => EventUncheckedCreateWithoutTenantInputSchema) ]),
});

export default EventCreateOrConnectWithoutTenantInputSchema;
