import { apiClient } from './client';
import type { CreateEventDto, EventResponseDto, EventsQueryDto } from '../../types/generated/event.dto.zod';
import { EventResponseDtoSchema, CreateEventDtoSchema } from '../../types/generated/event.dto.zod';

export interface EventsResponse {
  events: EventResponseDto[];
  total: number;
  page: number;
  limit: number;
}

export const eventsApi = {
  /**
   * Fetches events with runtime validation
   * Uses generated types from backend + Zod validation
   */
  getEvents: async (params: EventsQueryDto & { tenantId?: string }): Promise<EventsResponse> => {
    const { tenantId, ...queryParams } = params;
    
    const headers: Record<string, string> = {};
    if (tenantId) {
      headers['x-tenant-id'] = tenantId;
    }
    
    const data = await apiClient.get<EventsResponse>('/events', queryParams, headers);
    
    // Validate each event in the response
    const validatedEvents = data.events.map(event => 
      EventResponseDtoSchema.parse(event)
    );
    
    return {
      ...data,
      events: validatedEvents,
    };
  },

  /**
   * Creates a new event with runtime validation
   */
  createEvent: async (payload: CreateEventDto): Promise<EventResponseDto> => {
    // Validate input before sending
    const validatedPayload = CreateEventDtoSchema.parse(payload);
    
    const data = await apiClient.post<EventResponseDto>('/events', validatedPayload);
    
    // Validate response
    return EventResponseDtoSchema.parse(data);
  },

  /**
   * Safe version that returns validation errors instead of throwing
   */
  createEventSafe: async (payload: CreateEventDto) => {
    try {
      const inputResult = CreateEventDtoSchema.safeParse(payload);
      
      if (!inputResult.success) {
        return { success: false as const, error: inputResult.error };
      }

      const data = await apiClient.post<EventResponseDto>('/events', inputResult.data);
      const outputResult = EventResponseDtoSchema.safeParse(data);
      
      if (outputResult.success) {
        return { success: true as const, data: outputResult.data };
      } else {
        console.error('Event response validation failed:', outputResult.error);
        return { success: false as const, error: outputResult.error };
      }
    } catch (error) {
      console.error('Event creation failed:', error);
      return { success: false as const, error };
    }
  },
};
