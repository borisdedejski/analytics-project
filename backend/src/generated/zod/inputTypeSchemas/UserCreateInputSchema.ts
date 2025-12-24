import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { TenantCreateNestedOneWithoutUsersInputSchema } from './TenantCreateNestedOneWithoutUsersInputSchema';
import { EventCreateNestedManyWithoutUserInputSchema } from './EventCreateNestedManyWithoutUserInputSchema';

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.strictObject({
  id: z.string().optional(),
  email: z.string(),
  role: z.string(),
  createdAt: z.coerce.date().optional(),
  tenant: z.lazy(() => TenantCreateNestedOneWithoutUsersInputSchema),
  events: z.lazy(() => EventCreateNestedManyWithoutUserInputSchema).optional(),
});

export default UserCreateInputSchema;
