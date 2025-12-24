/**
 * Event Types
 * 
 * ⚠️ DEPRECATED: This file now re-exports from auto-generated types.
 * 
 * Types are auto-generated from backend DTOs. To update:
 * 1. cd backend
 * 2. npm run types:generate
 * 
 * See TYPE_GENERATION.md for more info.
 */

import { z } from 'zod';

// Re-export from generated types
export {
  EventResponseDtoSchema as EventSchema,
  CreateEventDtoSchema,
  type EventResponseDto as Event,
  type CreateEventDto as CreateEventPayload,
} from './generated/event.dto.zod';

// Custom schemas for frontend-specific needs
export const EventsResponseSchema = z.object({
  events: z.array(z.any()), // Will be validated individually
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

export type EventsResponse = z.infer<typeof EventsResponseSchema>;

