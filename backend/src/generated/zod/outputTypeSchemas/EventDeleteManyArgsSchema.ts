import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { EventWhereInputSchema } from '../inputTypeSchemas/EventWhereInputSchema'

export const EventDeleteManyArgsSchema: z.ZodType<Prisma.EventDeleteManyArgs> = z.object({
  where: EventWhereInputSchema.optional(), 
}).strict();

export default EventDeleteManyArgsSchema;
