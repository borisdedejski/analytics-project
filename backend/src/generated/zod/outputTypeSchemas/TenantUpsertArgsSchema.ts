import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { TenantWhereUniqueInputSchema } from '../inputTypeSchemas/TenantWhereUniqueInputSchema'
import { TenantCreateInputSchema } from '../inputTypeSchemas/TenantCreateInputSchema'
import { TenantUncheckedCreateInputSchema } from '../inputTypeSchemas/TenantUncheckedCreateInputSchema'
import { TenantUpdateInputSchema } from '../inputTypeSchemas/TenantUpdateInputSchema'
import { TenantUncheckedUpdateInputSchema } from '../inputTypeSchemas/TenantUncheckedUpdateInputSchema'

export const TenantUpsertArgsSchema: z.ZodType<Omit<Prisma.TenantUpsertArgs, "select" | "include">> = z.object({
  where: TenantWhereUniqueInputSchema, 
  create: z.union([ TenantCreateInputSchema, TenantUncheckedCreateInputSchema ]),
  update: z.union([ TenantUpdateInputSchema, TenantUncheckedUpdateInputSchema ]),
}).strict();

export default TenantUpsertArgsSchema;
