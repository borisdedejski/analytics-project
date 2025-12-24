import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { UserCreateManyTenantInputSchema } from './UserCreateManyTenantInputSchema';

export const UserCreateManyTenantInputEnvelopeSchema: z.ZodType<Prisma.UserCreateManyTenantInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => UserCreateManyTenantInputSchema), z.lazy(() => UserCreateManyTenantInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export default UserCreateManyTenantInputEnvelopeSchema;
