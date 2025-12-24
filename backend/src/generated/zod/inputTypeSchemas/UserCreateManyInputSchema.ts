import type { Prisma } from '@prisma/client';

import { z } from 'zod';

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.strictObject({
  id: z.string().optional(),
  tenantId: z.string(),
  email: z.string(),
  role: z.string(),
  createdAt: z.coerce.date().optional(),
});

export default UserCreateManyInputSchema;
