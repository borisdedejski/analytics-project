import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { EventScalarWhereInputSchema } from './EventScalarWhereInputSchema';
import { EventUpdateManyMutationInputSchema } from './EventUpdateManyMutationInputSchema';
import { EventUncheckedUpdateManyWithoutUserInputSchema } from './EventUncheckedUpdateManyWithoutUserInputSchema';

export const EventUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.EventUpdateManyWithWhereWithoutUserInput> = z.strictObject({
  where: z.lazy(() => EventScalarWhereInputSchema),
  data: z.union([ z.lazy(() => EventUpdateManyMutationInputSchema), z.lazy(() => EventUncheckedUpdateManyWithoutUserInputSchema) ]),
});

export default EventUpdateManyWithWhereWithoutUserInputSchema;
