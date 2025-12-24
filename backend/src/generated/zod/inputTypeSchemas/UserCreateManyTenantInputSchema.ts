import type { Prisma } from '@prisma/client';

import { z } from 'zod';

export const UserCreateManyTenantInputSchema: z.ZodType<Prisma.UserCreateManyTenantInput> = z.strictObject({
  id: z.string().optional(),
  email: z.string(),
  role: z.string(),
  createdAt: z.coerce.date().optional(),
});

export default UserCreateManyTenantInputSchema;
