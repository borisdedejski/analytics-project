import { z } from 'zod';

// Create Event DTO
export const CreateEventDtoSchema = z.object({
  tenantId: z.string().optional(),
  eventType: z.string(),
  userId: z.string().optional(),
  sessionId: z.string().optional(),
  timestamp: z.union([z.string(), z.date()]).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  page: z.string().optional(),
  browser: z.string().optional(),
  device: z.string().optional(),
  country: z.string().optional(),
});

export type CreateEventDto = z.infer<typeof CreateEventDtoSchema>;

// Event Response DTO
export const EventResponseDtoSchema = z.object({
  id: z.string(),
  eventType: z.string(),
  userId: z.string().optional(),
  sessionId: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  page: z.string().optional(),
  browser: z.string().optional(),
  device: z.string().optional(),
  country: z.string().optional(),
  timestamp: z.date(),
});

export type EventResponseDto = z.infer<typeof EventResponseDtoSchema>;

// Events Query DTO
export const EventsQueryDtoSchema = z.object({
  tenantId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  eventType: z.string().optional(),
  userId: z.string().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

export type EventsQueryDto = z.infer<typeof EventsQueryDtoSchema>;

