import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { TenantCountOutputTypeSelectSchema } from './TenantCountOutputTypeSelectSchema';

export const TenantCountOutputTypeArgsSchema: z.ZodType<Prisma.TenantCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => TenantCountOutputTypeSelectSchema).nullish(),
}).strict();

export default TenantCountOutputTypeSelectSchema;
