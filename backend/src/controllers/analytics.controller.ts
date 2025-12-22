import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analytics.service';

export class AnalyticsController {
  private analyticsService: AnalyticsService;

  constructor() {
    this.analyticsService = new AnalyticsService();
  }

  getSummary = async (req: Request, res: Response): Promise<void> => {
    try {
      const query = {
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        groupBy: (req.query.groupBy as 'hour' | 'day' | 'week' | 'month') || 'day',
      };

      if (!query.startDate || !query.endDate) {
        res.status(400).json({ error: 'startDate and endDate are required' });
        return;
      }

      const summary = await this.analyticsService.getAnalyticsSummary(query);
      res.json(summary);
    } catch (error) {
      console.error('Analytics error:', error);
      res.status(500).json({ error: 'Failed to fetch analytics summary' });
    }
  };
}

