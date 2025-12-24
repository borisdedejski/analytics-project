import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { TenantCreateNestedOneWithoutUsersInputSchema } from './TenantCreateNestedOneWithoutUsersInputSchema';

export const UserCreateWithoutEventsInputSchema: z.ZodType<Prisma.UserCreateWithoutEventsInput> = z.strictObject({
  id: z.string().optional(),
  email: z.string(),
  role: z.string(),
  createdAt: z.coerce.date().optional(),
  tenant: z.lazy(() => TenantCreateNestedOneWithoutUsersInputSchema),
});

export default UserCreateWithoutEventsInputSchema;
