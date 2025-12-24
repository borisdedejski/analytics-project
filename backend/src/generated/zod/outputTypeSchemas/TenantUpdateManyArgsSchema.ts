import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { TenantUpdateManyMutationInputSchema } from '../inputTypeSchemas/TenantUpdateManyMutationInputSchema'
import { TenantUncheckedUpdateManyInputSchema } from '../inputTypeSchemas/TenantUncheckedUpdateManyInputSchema'
import { TenantWhereInputSchema } from '../inputTypeSchemas/TenantWhereInputSchema'

export const TenantUpdateManyArgsSchema: z.ZodType<Prisma.TenantUpdateManyArgs> = z.object({
  data: z.union([ TenantUpdateManyMutationInputSchema, TenantUncheckedUpdateManyInputSchema ]),
  where: TenantWhereInputSchema.optional(), 
}).strict();

export default TenantUpdateManyArgsSchema;
