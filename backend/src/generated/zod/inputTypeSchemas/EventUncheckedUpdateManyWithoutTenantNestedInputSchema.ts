import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { EventCreateWithoutTenantInputSchema } from './EventCreateWithoutTenantInputSchema';
import { EventUncheckedCreateWithoutTenantInputSchema } from './EventUncheckedCreateWithoutTenantInputSchema';
import { EventCreateOrConnectWithoutTenantInputSchema } from './EventCreateOrConnectWithoutTenantInputSchema';
import { EventUpsertWithWhereUniqueWithoutTenantInputSchema } from './EventUpsertWithWhereUniqueWithoutTenantInputSchema';
import { EventCreateManyTenantInputEnvelopeSchema } from './EventCreateManyTenantInputEnvelopeSchema';
import { EventWhereUniqueInputSchema } from './EventWhereUniqueInputSchema';
import { EventUpdateWithWhereUniqueWithoutTenantInputSchema } from './EventUpdateWithWhereUniqueWithoutTenantInputSchema';
import { EventUpdateManyWithWhereWithoutTenantInputSchema } from './EventUpdateManyWithWhereWithoutTenantInputSchema';
import { EventScalarWhereInputSchema } from './EventScalarWhereInputSchema';

export const EventUncheckedUpdateManyWithoutTenantNestedInputSchema: z.ZodType<Prisma.EventUncheckedUpdateManyWithoutTenantNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => EventCreateWithoutTenantInputSchema), z.lazy(() => EventCreateWithoutTenantInputSchema).array(), z.lazy(() => EventUncheckedCreateWithoutTenantInputSchema), z.lazy(() => EventUncheckedCreateWithoutTenantInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EventCreateOrConnectWithoutTenantInputSchema), z.lazy(() => EventCreateOrConnectWithoutTenantInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => EventUpsertWithWhereUniqueWithoutTenantInputSchema), z.lazy(() => EventUpsertWithWhereUniqueWithoutTenantInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EventCreateManyTenantInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => EventWhereUniqueInputSchema), z.lazy(() => EventWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => EventWhereUniqueInputSchema), z.lazy(() => EventWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => EventWhereUniqueInputSchema), z.lazy(() => EventWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => EventWhereUniqueInputSchema), z.lazy(() => EventWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => EventUpdateWithWhereUniqueWithoutTenantInputSchema), z.lazy(() => EventUpdateWithWhereUniqueWithoutTenantInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => EventUpdateManyWithWhereWithoutTenantInputSchema), z.lazy(() => EventUpdateManyWithWhereWithoutTenantInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => EventScalarWhereInputSchema), z.lazy(() => EventScalarWhereInputSchema).array() ]).optional(),
});

export default EventUncheckedUpdateManyWithoutTenantNestedInputSchema;
