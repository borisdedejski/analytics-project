import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { EventWhereUniqueInputSchema } from './EventWhereUniqueInputSchema';
import { EventUpdateWithoutUserInputSchema } from './EventUpdateWithoutUserInputSchema';
import { EventUncheckedUpdateWithoutUserInputSchema } from './EventUncheckedUpdateWithoutUserInputSchema';

export const EventUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.EventUpdateWithWhereUniqueWithoutUserInput> = z.strictObject({
  where: z.lazy(() => EventWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => EventUpdateWithoutUserInputSchema), z.lazy(() => EventUncheckedUpdateWithoutUserInputSchema) ]),
});

export default EventUpdateWithWhereUniqueWithoutUserInputSchema;
