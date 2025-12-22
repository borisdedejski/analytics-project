import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class TenantController {
  /**
   * GET /api/tenants - List all tenants
   */
  listTenants = async (req: Request, res: Response): Promise<void> => {
    try {
      const tenants = await prisma.tenant.findMany({
        select: {
          id: true,
          name: true,
          region: true,
          plan: true,
          createdAt: true,
          _count: {
            select: {
              users: true,
              events: true,
              metrics: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      res.json(tenants);
    } catch (error) {
      console.error('Error listing tenants:', error);
      res.status(500).json({ error: 'Failed to list tenants' });
    }
  };

  /**
   * GET /api/tenants/:tenantId - Get tenant details
   */
  getTenant = async (req: Request, res: Response): Promise<void> => {
    try {
      const { tenantId } = req.params;

      const tenant = await prisma.tenant.findUnique({
        where: { id: tenantId },
        include: {
          _count: {
            select: {
              users: true,
              events: true,
              metrics: true,
            },
          },
        },
      });

      if (!tenant) {
        res.status(404).json({ error: 'Tenant not found' });
        return;
      }

      res.json(tenant);
    } catch (error) {
      console.error('Error fetching tenant:', error);
      res.status(500).json({ error: 'Failed to fetch tenant' });
    }
  };
}

