import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { EventWhereInputSchema } from '../inputTypeSchemas/EventWhereInputSchema'
import { EventOrderByWithRelationInputSchema } from '../inputTypeSchemas/EventOrderByWithRelationInputSchema'
import { EventWhereUniqueInputSchema } from '../inputTypeSchemas/EventWhereUniqueInputSchema'
import { EventScalarFieldEnumSchema } from '../inputTypeSchemas/EventScalarFieldEnumSchema'

export const EventFindFirstArgsSchema: z.ZodType<Omit<Prisma.EventFindFirstArgs, "select" | "include">> = z.object({
  where: EventWhereInputSchema.optional(), 
  orderBy: z.union([ EventOrderByWithRelationInputSchema.array(), EventOrderByWithRelationInputSchema ]).optional(),
  cursor: EventWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EventScalarFieldEnumSchema, EventScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export default EventFindFirstArgsSchema;
