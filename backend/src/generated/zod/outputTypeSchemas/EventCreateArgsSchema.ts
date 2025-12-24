import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { EventCreateInputSchema } from '../inputTypeSchemas/EventCreateInputSchema'
import { EventUncheckedCreateInputSchema } from '../inputTypeSchemas/EventUncheckedCreateInputSchema'

export const EventCreateArgsSchema: z.ZodType<Omit<Prisma.EventCreateArgs, "select" | "include">> = z.object({
  data: z.union([ EventCreateInputSchema, EventUncheckedCreateInputSchema ]),
}).strict();

export default EventCreateArgsSchema;
