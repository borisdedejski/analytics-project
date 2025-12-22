import { apiClient } from './client';
import { Event, EventsResponse, EventsResponseSchema, CreateEventPayload, EventSchema } from '@/types/event';

export interface EventsParams {
  startDate?: string;
  endDate?: string;
  eventType?: string;
  userId?: string;
  page?: number;
  limit?: number;
}

export const eventsApi = {
  getEvents: async (params: EventsParams): Promise<EventsResponse> => {
    const data = await apiClient.get<EventsResponse>('/events', params);
    return EventsResponseSchema.parse(data);
  },

  createEvent: async (payload: CreateEventPayload): Promise<Event> => {
    const data = await apiClient.post<Event>('/events', payload);
    return EventSchema.parse(data);
  },
};

