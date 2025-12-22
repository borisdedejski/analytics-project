import { z } from 'zod';

export const EventSchema = z.object({
  id: z.string(),
  eventType: z.string(),
  userId: z.string().optional(),
  sessionId: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  page: z.string().optional(),
  browser: z.string().optional(),
  device: z.string().optional(),
  country: z.string().optional(),
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
  eventType: string;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
  page?: string;
  browser?: string;
  device?: string;
  country?: string;
}

