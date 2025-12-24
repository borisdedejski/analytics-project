import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';

const router = Router();
const analyticsController = new AnalyticsController();

router.get('/summary', analyticsController.getSummary);
router.post('/clear-cache', analyticsController.clearCache);

export default router;

