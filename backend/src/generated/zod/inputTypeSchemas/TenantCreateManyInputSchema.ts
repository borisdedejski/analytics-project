import type { Prisma } from '@prisma/client';

import { z } from 'zod';

export const TenantCreateManyInputSchema: z.ZodType<Prisma.TenantCreateManyInput> = z.strictObject({
  id: z.string().optional(),
  name: z.string(),
  region: z.string(),
  plan: z.string(),
  createdAt: z.coerce.date().optional(),
});

export default TenantCreateManyInputSchema;
