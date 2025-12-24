/**
 * Event Repository Tests
 * 
 * Tests data access layer for event queries
 */

import { PrismaClient } from '@prisma/client';
import { EventRepository } from '../../repositories/event.repository';

// Mock Prisma
const mockPrisma = new PrismaClient() as jest.Mocked<PrismaClient>;

describe('EventRepository', () => {
  let eventRepository: EventRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    eventRepository = new EventRepository();
  });

  describe('getTotalCount', () => {
    it('should return total event count for date range', async () => {
      // Arrange
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      mockPrisma.event.count = jest.fn().mockResolvedValue(1500);

      // Act
      const result = await eventRepository.getTotalCount(startDate, endDate);

      // Assert
      expect(result).toBe(1500);
      expect(mockPrisma.event.count).toHaveBeenCalledWith({
        where: {
          timestamp: {
            gte: startDate,
            lte: endDate,
          },
        },
      });
    });

    it('should filter by tenantId when provided', async () => {
      // Arrange
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      const tenantId = 'tenant-123';
      mockPrisma.event.count = jest.fn().mockResolvedValue(750);

      // Act
      const result = await eventRepository.getTotalCount(startDate, endDate, tenantId);

      // Assert
      expect(result).toBe(750);
      expect(mockPrisma.event.count).toHaveBeenCalledWith({
        where: {
          timestamp: {
            gte: startDate,
            lte: endDate,
          },
          tenantId: 'tenant-123',
        },
      });
    });
  });

  describe('getUniqueUserCount', () => {
    it('should return count of unique users', async () => {
      // Arrange
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      mockPrisma.event.findMany = jest.fn().mockResolvedValue([
        { userId: 'user-1' },
        { userId: 'user-2' },
        { userId: 'user-3' },
      ]);

      // Act
      const result = await eventRepository.getUniqueUserCount(startDate, endDate);

      // Assert
      expect(result).toBe(3);
      expect(mockPrisma.event.findMany).toHaveBeenCalledWith({
        where: {
          timestamp: { gte: startDate, lte: endDate },
          userId: { not: null },
        },
        select: { userId: true },
        distinct: ['userId'],
      });
    });
  });

  describe('getEventCountByType', () => {
    it('should return events grouped by type', async () => {
      // Arrange
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      mockPrisma.event.groupBy = jest.fn().mockResolvedValue([
        { eventType: 'click', _count: { eventType: 500 } },
        { eventType: 'view', _count: { eventType: 300 } },
        { eventType: 'purchase', _count: { eventType: 200 } },
      ]);

      // Act
      const result = await eventRepository.getEventCountByType(startDate, endDate);

      // Assert
      expect(result).toEqual([
        { eventtype: 'click', count: '500' },
        { eventtype: 'view', count: '300' },
        { eventtype: 'purchase', count: '200' },
      ]);
    });
  });

  describe('findAll', () => {
    it('should return paginated events', async () => {
      // Arrange
      const query = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        page: 1,
        limit: 10,
      };

      const mockEvents = [
        { id: '1', eventType: 'click', timestamp: new Date() },
        { id: '2', eventType: 'view', timestamp: new Date() },
      ];

      mockPrisma.event.findMany = jest.fn().mockResolvedValue(mockEvents);
      mockPrisma.event.count = jest.fn().mockResolvedValue(25);

      // Act
      const [events, total] = await eventRepository.findAll(query);

      // Assert
      expect(events).toEqual(mockEvents);
      expect(total).toBe(25);
      expect(mockPrisma.event.findMany).toHaveBeenCalledWith({
        where: {
          timestamp: {
            gte: new Date('2024-01-01T00:00:00Z'),
            lte: new Date('2024-01-31T23:59:59.999Z'),
          },
        },
        orderBy: { timestamp: 'desc' },
        skip: 0,
        take: 10,
      });
    });

    it('should filter by eventType when provided', async () => {
      // Arrange
      const query = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        eventType: 'click',
        page: 1,
        limit: 10,
      };

      mockPrisma.event.findMany = jest.fn().mockResolvedValue([]);
      mockPrisma.event.count = jest.fn().mockResolvedValue(0);

      // Act
      await eventRepository.findAll(query);

      // Assert
      expect(mockPrisma.event.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            eventType: 'click',
          }),
        })
      );
    });
  });
});

