import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { EventWhereUniqueInputSchema } from './EventWhereUniqueInputSchema';
import { EventUpdateWithoutUserInputSchema } from './EventUpdateWithoutUserInputSchema';
import { EventUncheckedUpdateWithoutUserInputSchema } from './EventUncheckedUpdateWithoutUserInputSchema';
import { EventCreateWithoutUserInputSchema } from './EventCreateWithoutUserInputSchema';
import { EventUncheckedCreateWithoutUserInputSchema } from './EventUncheckedCreateWithoutUserInputSchema';

export const EventUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.EventUpsertWithWhereUniqueWithoutUserInput> = z.strictObject({
  where: z.lazy(() => EventWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => EventUpdateWithoutUserInputSchema), z.lazy(() => EventUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => EventCreateWithoutUserInputSchema), z.lazy(() => EventUncheckedCreateWithoutUserInputSchema) ]),
});

export default EventUpsertWithWhereUniqueWithoutUserInputSchema;
