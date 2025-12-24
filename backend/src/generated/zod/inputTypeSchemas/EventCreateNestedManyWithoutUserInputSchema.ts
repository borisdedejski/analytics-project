import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { EventCreateWithoutUserInputSchema } from './EventCreateWithoutUserInputSchema';
import { EventUncheckedCreateWithoutUserInputSchema } from './EventUncheckedCreateWithoutUserInputSchema';
import { EventCreateOrConnectWithoutUserInputSchema } from './EventCreateOrConnectWithoutUserInputSchema';
import { EventCreateManyUserInputEnvelopeSchema } from './EventCreateManyUserInputEnvelopeSchema';
import { EventWhereUniqueInputSchema } from './EventWhereUniqueInputSchema';

export const EventCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.EventCreateNestedManyWithoutUserInput> = z.strictObject({
  create: z.union([ z.lazy(() => EventCreateWithoutUserInputSchema), z.lazy(() => EventCreateWithoutUserInputSchema).array(), z.lazy(() => EventUncheckedCreateWithoutUserInputSchema), z.lazy(() => EventUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => EventCreateOrConnectWithoutUserInputSchema), z.lazy(() => EventCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => EventCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => EventWhereUniqueInputSchema), z.lazy(() => EventWhereUniqueInputSchema).array() ]).optional(),
});

export default EventCreateNestedManyWithoutUserInputSchema;
