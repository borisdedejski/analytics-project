import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { EventWhereUniqueInputSchema } from '../inputTypeSchemas/EventWhereUniqueInputSchema'

export const EventDeleteArgsSchema: z.ZodType<Omit<Prisma.EventDeleteArgs, "select" | "include">> = z.object({
  where: EventWhereUniqueInputSchema, 
}).strict();

export default EventDeleteArgsSchema;
