import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { EventWhereUniqueInputSchema } from './EventWhereUniqueInputSchema';
import { EventCreateWithoutUserInputSchema } from './EventCreateWithoutUserInputSchema';
import { EventUncheckedCreateWithoutUserInputSchema } from './EventUncheckedCreateWithoutUserInputSchema';

export const EventCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.EventCreateOrConnectWithoutUserInput> = z.strictObject({
  where: z.lazy(() => EventWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => EventCreateWithoutUserInputSchema), z.lazy(() => EventUncheckedCreateWithoutUserInputSchema) ]),
});

export default EventCreateOrConnectWithoutUserInputSchema;
