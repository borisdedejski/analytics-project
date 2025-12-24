import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { EventWhereUniqueInputSchema } from '../inputTypeSchemas/EventWhereUniqueInputSchema'

export const EventFindUniqueOrThrowArgsSchema: z.ZodType<Omit<Prisma.EventFindUniqueOrThrowArgs, "select" | "include">> = z.object({
  where: EventWhereUniqueInputSchema, 
}).strict();

export default EventFindUniqueOrThrowArgsSchema;
