import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { EventCreateWithoutUserInputSchema } from './EventCreateWithoutUserInputSchema';
import { EventUncheckedCreateWithoutUserInputSchema } from './EventUncheckedCreateWithoutUserInputSchema';
import { EventCreateOrConnectWithoutUserInputSchema } from './EventCreateOrConnectWithoutUserInputSchema';
import { EventUpsertWithWhereUniqueWithoutUserInputSchema } from './EventUpsertWithWhereUniqueWithoutUserInputSchema';
import { EventCreateManyUserInputEnvelopeSchema } from './EventCreateManyUserInputEnvelopeSchema';
import { EventWhereUniqueInputSchema } from './EventWhereUniqueInputSchema';
import { EventUpdateWithWhereUniqueWithoutUserInputSchema } from './EventUpdateWithWhereUniqueWithoutUserInputSchema';
import { EventUpdateManyWithWhereWithoutUserInputSchema } from './EventUpdateManyWithWhereWithoutUserInputSchema';
import { EventScalarWhereInputSchema } from './EventScalarWhereInputSchema';

export const EventUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.EventUpdateManyWithoutUserNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => EventCreateWithoutUserInputSchema), z.lazy(() => EventCreateWithoutUserInputSchema).array(), z.lazy(() => EventUncheckedCreateWithoutUserInputSchema), z.lazy(() => EventUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EventCreateOrConnectWithoutUserInputSchema), z.lazy(() => EventCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => EventUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => EventUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EventCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => EventWhereUniqueInputSchema), z.lazy(() => EventWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => EventWhereUniqueInputSchema), z.lazy(() => EventWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => EventWhereUniqueInputSchema), z.lazy(() => EventWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => EventWhereUniqueInputSchema), z.lazy(() => EventWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => EventUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => EventUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => EventUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => EventUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => EventScalarWhereInputSchema), z.lazy(() => EventScalarWhereInputSchema).array() ]).optional(),
});

export default EventUpdateManyWithoutUserNestedInputSchema;
