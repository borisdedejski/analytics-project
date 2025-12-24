import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UserController {
  /**
   * Get all users for a tenant
   */
  getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const tenantId = req.query.tenantId as string;
      
      const where = tenantId ? { tenantId } : {};
      
      const users = await prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          tenantId: true,
          role: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  };

  /**
   * Mock login - accepts any password, just finds user by email
   */
  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
      }

      // Find user by email (case-insensitive)
      const user = await prisma.user.findFirst({
        where: {
          email: {
            equals: email,
            mode: 'insensitive',
          },
        },
        select: {
          id: true,
          email: true,
          tenantId: true,
          role: true,
        },
      });

      if (!user) {
        res.status(401).json({ error: 'User not found with this email' });
        return;
      }

      // Password is accepted (no validation - demo mode)
      res.json({
        user,
        message: 'Login successful',
      });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  };
}

