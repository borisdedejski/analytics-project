import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { StringFieldUpdateOperationsInputSchema } from './StringFieldUpdateOperationsInputSchema';
import { DateTimeFieldUpdateOperationsInputSchema } from './DateTimeFieldUpdateOperationsInputSchema';
import { TenantUpdateOneRequiredWithoutUsersNestedInputSchema } from './TenantUpdateOneRequiredWithoutUsersNestedInputSchema';
import { EventUpdateManyWithoutUserNestedInputSchema } from './EventUpdateManyWithoutUserNestedInputSchema';

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  tenant: z.lazy(() => TenantUpdateOneRequiredWithoutUsersNestedInputSchema).optional(),
  events: z.lazy(() => EventUpdateManyWithoutUserNestedInputSchema).optional(),
});

export default UserUpdateInputSchema;
