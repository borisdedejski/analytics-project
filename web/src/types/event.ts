import { z } from 'zod';

export const EventSchema = z.object({
  id: z.string(),
  eventType: z.string(),
  userId: z.string().nullable().optional(),
  sessionId: z.string().nullable().optional(),
  metadata: z.record(z.any()).nullable().optional(),
  page: z.string().nullable().optional(),
  browser: z.string().nullable().optional(),
  device: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  timestamp: z.string(),
});

export const EventsResponseSchema = z.object({
  events: z.array(EventSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

export type Event = z.infer<typeof EventSchema>;
export type EventsResponse = z.infer<typeof EventsResponseSchema>;

export interface CreateEventPayload {
  tenantId?: string;
  eventType: string;
  userId?: string;
  sessionId?: string;
  timestamp?: string;
  metadata?: Record<string, any>;
  page?: string;
  browser?: string;
  device?: string;
  country?: string;
}

