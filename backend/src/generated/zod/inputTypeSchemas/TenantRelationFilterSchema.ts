import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { TenantWhereInputSchema } from './TenantWhereInputSchema';

export const TenantRelationFilterSchema: z.ZodType<Prisma.TenantRelationFilter> = z.strictObject({
  is: z.lazy(() => TenantWhereInputSchema).optional(),
  isNot: z.lazy(() => TenantWhereInputSchema).optional(),
});

export default TenantRelationFilterSchema;
