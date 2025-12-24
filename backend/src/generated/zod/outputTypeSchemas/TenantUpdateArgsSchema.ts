import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { TenantUpdateInputSchema } from '../inputTypeSchemas/TenantUpdateInputSchema'
import { TenantUncheckedUpdateInputSchema } from '../inputTypeSchemas/TenantUncheckedUpdateInputSchema'
import { TenantWhereUniqueInputSchema } from '../inputTypeSchemas/TenantWhereUniqueInputSchema'

export const TenantUpdateArgsSchema: z.ZodType<Omit<Prisma.TenantUpdateArgs, "select" | "include">> = z.object({
  data: z.union([ TenantUpdateInputSchema, TenantUncheckedUpdateInputSchema ]),
  where: TenantWhereUniqueInputSchema, 
}).strict();

export default TenantUpdateArgsSchema;
