import { Request, Response } from 'express';
import { EventService } from '../services/event.service';

export class EventController {
  private eventService: EventService;

  constructor() {
    this.eventService = new EventService();
  }

  createEvent = async (req: Request, res: Response): Promise<void> => {
    try {
      const event = await this.eventService.createEvent(req.body);
      res.status(201).json(event);
    } catch (error) {
      console.error('Error creating event:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create event';
      res.status(500).json({ error: errorMessage });
    }
  };

  getEvents = async (req: Request, res: Response): Promise<void> => {
    try {
      // Extract tenantId from headers (multi-tenancy)
      const tenantId = req.headers['x-tenant-id'] as string | undefined;
      
      const query = {
        tenantId,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        eventType: req.query.eventType as string,
        userId: req.query.userId as string,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 50,
      };

      const result = await this.eventService.getEvents(query);
      res.json(result);
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ error: 'Failed to fetch events' });
    }
  };

  getEventById = async (req: Request, res: Response): Promise<void> => {
    try {
      const event = await this.eventService.getEventById(req.params.id);
      if (!event) {
        res.status(404).json({ error: 'Event not found' });
        return;
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch event' });
    }
  };
}

