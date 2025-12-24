import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { TenantCreateInputSchema } from '../inputTypeSchemas/TenantCreateInputSchema'
import { TenantUncheckedCreateInputSchema } from '../inputTypeSchemas/TenantUncheckedCreateInputSchema'

export const TenantCreateArgsSchema: z.ZodType<Omit<Prisma.TenantCreateArgs, "select" | "include">> = z.object({
  data: z.union([ TenantCreateInputSchema, TenantUncheckedCreateInputSchema ]),
}).strict();

export default TenantCreateArgsSchema;
