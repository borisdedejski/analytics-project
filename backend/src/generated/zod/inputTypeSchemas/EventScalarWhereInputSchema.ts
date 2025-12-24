import type { Prisma } from '@prisma/client';

import { z } from 'zod';
import { StringFilterSchema } from './StringFilterSchema';
import { StringNullableFilterSchema } from './StringNullableFilterSchema';
import { DateTimeFilterSchema } from './DateTimeFilterSchema';
import { JsonNullableFilterSchema } from './JsonNullableFilterSchema';

export const EventScalarWhereInputSchema: z.ZodType<Prisma.EventScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => EventScalarWhereInputSchema), z.lazy(() => EventScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EventScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EventScalarWhereInputSchema), z.lazy(() => EventScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  tenantId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  sessionId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  eventType: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  timestamp: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  metadata: z.lazy(() => JsonNullableFilterSchema).optional(),
});

export default EventScalarWhereInputSchema;
