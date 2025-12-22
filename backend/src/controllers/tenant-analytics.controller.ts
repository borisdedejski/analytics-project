import { Request, Response } from 'express';
import { TenantAnalyticsService } from '../services/tenant-analytics.service';

export class TenantAnalyticsController {
  private service: TenantAnalyticsService;

  constructor() {
    this.service = new TenantAnalyticsService();
  }

  /**
   * GET /api/tenants/:tenantId/overview
   */
  getOverview = async (req: Request, res: Response): Promise<void> => {
    try {
      const { tenantId } = req.params;
      const { from, to } = req.query;

      if (!from || !to) {
        res.status(400).json({ error: 'from and to query parameters are required (ISO 8601 format)' });
        return;
      }

      const overview = await this.service.getTenantOverview(tenantId, {
        from: from as string,
        to: to as string,
      });

      res.json(overview);
    } catch (error) {
      console.error('Error fetching tenant overview:', error);
      res.status(500).json({ error: 'Failed to fetch tenant overview' });
    }
  };

  /**
   * GET /api/tenants/:tenantId/events
   */
  getEvents = async (req: Request, res: Response): Promise<void> => {
    try {
      const { tenantId } = req.params;
      const { from, to, eventType, page, limit } = req.query;

      if (!from || !to) {
        res.status(400).json({ error: 'from and to query parameters are required (ISO 8601 format)' });
        return;
      }

      const events = await this.service.getTenantEvents(tenantId, {
        from: from as string,
        to: to as string,
        eventType: eventType as string | undefined,
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
      });

      res.json(events);
    } catch (error) {
      console.error('Error fetching tenant events:', error);
      res.status(500).json({ error: 'Failed to fetch tenant events' });
    }
  };

  /**
   * GET /api/tenants/:tenantId/metrics
   */
  getMetrics = async (req: Request, res: Response): Promise<void> => {
    try {
      const { tenantId } = req.params;
      const { from, to, metricName, serviceName } = req.query;

      if (!from || !to) {
        res.status(400).json({ error: 'from and to query parameters are required (ISO 8601 format)' });
        return;
      }

      const metrics = await this.service.getTenantMetrics(tenantId, {
        from: from as string,
        to: to as string,
        metricName: metricName as string | undefined,
        serviceName: serviceName as string | undefined,
      });

      res.json(metrics);
    } catch (error) {
      console.error('Error fetching tenant metrics:', error);
      res.status(500).json({ error: 'Failed to fetch tenant metrics' });
    }
  };
}

