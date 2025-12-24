import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { EventCreateWithoutTenantInputSchema } from './EventCreateWithoutTenantInputSchema';
import { EventUncheckedCreateWithoutTenantInputSchema } from './EventUncheckedCreateWithoutTenantInputSchema';
import { EventCreateOrConnectWithoutTenantInputSchema } from './EventCreateOrConnectWithoutTenantInputSchema';
import { EventCreateManyTenantInputEnvelopeSchema } from './EventCreateManyTenantInputEnvelopeSchema';
import { EventWhereUniqueInputSchema } from './EventWhereUniqueInputSchema';

export const EventUncheckedCreateNestedManyWithoutTenantInputSchema: z.ZodType<Prisma.EventUncheckedCreateNestedManyWithoutTenantInput> = z.strictObject({
  create: z.union([ z.lazy(() => EventCreateWithoutTenantInputSchema), z.lazy(() => EventCreateWithoutTenantInputSchema).array(), z.lazy(() => EventUncheckedCreateWithoutTenantInputSchema), z.lazy(() => EventUncheckedCreateWithoutTenantInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EventCreateOrConnectWithoutTenantInputSchema), z.lazy(() => EventCreateOrConnectWithoutTenantInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EventCreateManyTenantInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => EventWhereUniqueInputSchema), z.lazy(() => EventWhereUniqueInputSchema).array() ]).optional(),
});

export default EventUncheckedCreateNestedManyWithoutTenantInputSchema;
