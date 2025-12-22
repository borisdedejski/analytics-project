export interface CreateEventDto {
  tenantId?: string; // Optional for backward compatibility
  eventType: string;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
  page?: string;
  browser?: string;
  device?: string;
  country?: string;
}

export interface EventResponseDto {
  id: string;
  eventType: string;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
  page?: string;
  browser?: string;
  device?: string;
  country?: string;
  timestamp: Date;
}

export interface EventsQueryDto {
  startDate?: string;
  endDate?: string;
  eventType?: string;
  userId?: string;
  page?: number;
  limit?: number;
}

