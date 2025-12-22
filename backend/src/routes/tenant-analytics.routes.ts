import { Router } from 'express';
import { TenantAnalyticsController } from '../controllers/tenant-analytics.controller';
import { TenantController } from '../controllers/tenant.controller';

const router = Router();
const analyticsController = new TenantAnalyticsController();
const tenantController = new TenantController();

// Tenant management endpoints
router.get('/', tenantController.listTenants);
router.get('/:tenantId', tenantController.getTenant);

// Tenant analytics endpoints
router.get('/:tenantId/overview', analyticsController.getOverview);
router.get('/:tenantId/events', analyticsController.getEvents);
router.get('/:tenantId/metrics', analyticsController.getMetrics);

export default router;

