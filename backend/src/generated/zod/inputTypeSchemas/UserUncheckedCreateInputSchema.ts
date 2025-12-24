import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { EventUncheckedCreateNestedManyWithoutUserInputSchema } from './EventUncheckedCreateNestedManyWithoutUserInputSchema';

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.strictObject({
  id: z.string().optional(),
  tenantId: z.string(),
  email: z.string(),
  role: z.string(),
  createdAt: z.coerce.date().optional(),
  events: z.lazy(() => EventUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
});

export default UserUncheckedCreateInputSchema;
