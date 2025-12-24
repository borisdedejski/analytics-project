import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { SortOrderSchema } from './SortOrderSchema';
import { UserOrderByRelationAggregateInputSchema } from './UserOrderByRelationAggregateInputSchema';
import { EventOrderByRelationAggregateInputSchema } from './EventOrderByRelationAggregateInputSchema';
import { MetricOrderByRelationAggregateInputSchema } from './MetricOrderByRelationAggregateInputSchema';

export const TenantOrderByWithRelationInputSchema: z.ZodType<Prisma.TenantOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  region: z.lazy(() => SortOrderSchema).optional(),
  plan: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  users: z.lazy(() => UserOrderByRelationAggregateInputSchema).optional(),
  events: z.lazy(() => EventOrderByRelationAggregateInputSchema).optional(),
  metrics: z.lazy(() => MetricOrderByRelationAggregateInputSchema).optional(),
});

export default TenantOrderByWithRelationInputSchema;
