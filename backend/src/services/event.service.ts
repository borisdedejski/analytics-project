import { EventRepository } from "../repositories/event.repository";
import {
  CreateEventDto,
  EventResponseDto,
  EventsQueryDto,
} from "../dtos/event.dto";
import redisClient from "../config/redis";

export class EventService {
  private eventRepository: EventRepository;

  constructor() {
    this.eventRepository = new EventRepository();
  }

  async createEvent(data: CreateEventDto): Promise<EventResponseDto> {
    const event = await this.eventRepository.create(data);

    await redisClient.del("analytics:summary:*");

    return this.mapToDto(event);
  }

  async getEvents(query: EventsQueryDto): Promise<{
    events: EventResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const [events, total] = await this.eventRepository.findAll(query);

    return {
      events: events.map(this.mapToDto),
      total,
      page: query.page || 1,
      limit: query.limit || 50,
    };
  }

  async getEventById(id: string): Promise<EventResponseDto | null> {
    const event = await this.eventRepository.findById(id);
    return event ? this.mapToDto(event) : null;
  }

  private mapToDto(event: any): EventResponseDto {
    return {
      id: event.id,
      eventType: event.eventType,
      userId: event.userId,
      sessionId: event.sessionId,
      metadata: event.metadata,
      page: event.page,
      browser: event.browser,
      device: event.device,
      country: event.country,
      timestamp: event.timestamp,
    };
  }
}
