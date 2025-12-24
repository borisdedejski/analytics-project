import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { EventUpdateInputSchema } from '../inputTypeSchemas/EventUpdateInputSchema'
import { EventUncheckedUpdateInputSchema } from '../inputTypeSchemas/EventUncheckedUpdateInputSchema'
import { EventWhereUniqueInputSchema } from '../inputTypeSchemas/EventWhereUniqueInputSchema'

export const EventUpdateArgsSchema: z.ZodType<Omit<Prisma.EventUpdateArgs, "select" | "include">> = z.object({
  data: z.union([ EventUpdateInputSchema, EventUncheckedUpdateInputSchema ]),
  where: EventWhereUniqueInputSchema, 
}).strict();

export default EventUpdateArgsSchema;
