import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { EventWhereUniqueInputSchema } from '../inputTypeSchemas/EventWhereUniqueInputSchema'

export const EventFindUniqueArgsSchema: z.ZodType<Omit<Prisma.EventFindUniqueArgs, "select" | "include">> = z.object({
  where: EventWhereUniqueInputSchema, 
}).strict();

export default EventFindUniqueArgsSchema;
