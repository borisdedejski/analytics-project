import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { EventUncheckedCreateNestedManyWithoutUserInputSchema } from './EventUncheckedCreateNestedManyWithoutUserInputSchema';

export const UserUncheckedCreateWithoutTenantInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutTenantInput> = z.strictObject({
  id: z.string().optional(),
  email: z.string(),
  role: z.string(),
  createdAt: z.coerce.date().optional(),
  events: z.lazy(() => EventUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
});

export default UserUncheckedCreateWithoutTenantInputSchema;
