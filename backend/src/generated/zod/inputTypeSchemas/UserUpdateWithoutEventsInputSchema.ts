import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { StringFieldUpdateOperationsInputSchema } from './StringFieldUpdateOperationsInputSchema';
import { DateTimeFieldUpdateOperationsInputSchema } from './DateTimeFieldUpdateOperationsInputSchema';
import { TenantUpdateOneRequiredWithoutUsersNestedInputSchema } from './TenantUpdateOneRequiredWithoutUsersNestedInputSchema';

export const UserUpdateWithoutEventsInputSchema: z.ZodType<Prisma.UserUpdateWithoutEventsInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  tenant: z.lazy(() => TenantUpdateOneRequiredWithoutUsersNestedInputSchema).optional(),
});

export default UserUpdateWithoutEventsInputSchema;
