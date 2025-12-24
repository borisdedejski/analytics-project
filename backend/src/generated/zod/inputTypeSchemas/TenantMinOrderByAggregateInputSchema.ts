import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { SortOrderSchema } from './SortOrderSchema';

export const TenantMinOrderByAggregateInputSchema: z.ZodType<Prisma.TenantMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  region: z.lazy(() => SortOrderSchema).optional(),
  plan: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
});

export default TenantMinOrderByAggregateInputSchema;
