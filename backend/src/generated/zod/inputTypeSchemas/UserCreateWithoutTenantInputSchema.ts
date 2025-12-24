import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { EventCreateNestedManyWithoutUserInputSchema } from './EventCreateNestedManyWithoutUserInputSchema';

export const UserCreateWithoutTenantInputSchema: z.ZodType<Prisma.UserCreateWithoutTenantInput> = z.strictObject({
  id: z.string().optional(),
  email: z.string(),
  role: z.string(),
  createdAt: z.coerce.date().optional(),
  events: z.lazy(() => EventCreateNestedManyWithoutUserInputSchema).optional(),
});

export default UserCreateWithoutTenantInputSchema;
