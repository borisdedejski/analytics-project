import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { EventWhereUniqueInputSchema } from '../inputTypeSchemas/EventWhereUniqueInputSchema'
import { EventCreateInputSchema } from '../inputTypeSchemas/EventCreateInputSchema'
import { EventUncheckedCreateInputSchema } from '../inputTypeSchemas/EventUncheckedCreateInputSchema'
import { EventUpdateInputSchema } from '../inputTypeSchemas/EventUpdateInputSchema'
import { EventUncheckedUpdateInputSchema } from '../inputTypeSchemas/EventUncheckedUpdateInputSchema'

export const EventUpsertArgsSchema: z.ZodType<Omit<Prisma.EventUpsertArgs, "select" | "include">> = z.object({
  where: EventWhereUniqueInputSchema, 
  create: z.union([ EventCreateInputSchema, EventUncheckedCreateInputSchema ]),
  update: z.union([ EventUpdateInputSchema, EventUncheckedUpdateInputSchema ]),
}).strict();

export default EventUpsertArgsSchema;
