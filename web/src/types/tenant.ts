import { z } from 'zod';

export const TenantSchema = z.object({
  id: z.string(),
  name: z.string(),
  region: z.string(),
  plan: z.string(),
  createdAt: z.string(),
  _count: z.object({
    users: z.number(),
    events: z.number(),
    metrics: z.number(),
  }).optional(),
});

export type Tenant = z.infer<typeof TenantSchema>;

