import type { Prisma } from '@prisma/client';

import { z } from 'zod';

export const UserUncheckedCreateWithoutEventsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutEventsInput> = z.strictObject({
  id: z.string().optional(),
  tenantId: z.string(),
  email: z.string(),
  role: z.string(),
  createdAt: z.coerce.date().optional(),
});

export default UserUncheckedCreateWithoutEventsInputSchema;
