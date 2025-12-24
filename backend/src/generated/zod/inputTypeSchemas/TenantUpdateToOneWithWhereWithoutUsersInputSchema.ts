import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { TenantWhereInputSchema } from './TenantWhereInputSchema';
import { TenantUpdateWithoutUsersInputSchema } from './TenantUpdateWithoutUsersInputSchema';
import { TenantUncheckedUpdateWithoutUsersInputSchema } from './TenantUncheckedUpdateWithoutUsersInputSchema';

export const TenantUpdateToOneWithWhereWithoutUsersInputSchema: z.ZodType<Prisma.TenantUpdateToOneWithWhereWithoutUsersInput> = z.strictObject({
  where: z.lazy(() => TenantWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => TenantUpdateWithoutUsersInputSchema), z.lazy(() => TenantUncheckedUpdateWithoutUsersInputSchema) ]),
});

export default TenantUpdateToOneWithWhereWithoutUsersInputSchema;
