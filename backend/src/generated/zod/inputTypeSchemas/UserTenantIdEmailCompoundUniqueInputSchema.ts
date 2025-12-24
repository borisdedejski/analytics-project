import type { Prisma } from '@prisma/client';

import { z } from 'zod';

export const UserTenantIdEmailCompoundUniqueInputSchema: z.ZodType<Prisma.UserTenantIdEmailCompoundUniqueInput> = z.strictObject({
  tenantId: z.string(),
  email: z.string(),
});

export default UserTenantIdEmailCompoundUniqueInputSchema;
