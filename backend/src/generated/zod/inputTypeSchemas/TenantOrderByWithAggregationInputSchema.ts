import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { SortOrderSchema } from './SortOrderSchema';
import { TenantCountOrderByAggregateInputSchema } from './TenantCountOrderByAggregateInputSchema';
import { TenantMaxOrderByAggregateInputSchema } from './TenantMaxOrderByAggregateInputSchema';
import { TenantMinOrderByAggregateInputSchema } from './TenantMinOrderByAggregateInputSchema';

export const TenantOrderByWithAggregationInputSchema: z.ZodType<Prisma.TenantOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  region: z.lazy(() => SortOrderSchema).optional(),
  plan: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => TenantCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => TenantMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => TenantMinOrderByAggregateInputSchema).optional(),
});

export default TenantOrderByWithAggregationInputSchema;
