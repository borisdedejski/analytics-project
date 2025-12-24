/**
 * Analytics Service Tests
 * 
 * Tests business logic layer for analytics data aggregation and caching
 */

import { AnalyticsService } from '../../services/analytics.service';
import { EventRepository } from '../../repositories/event.repository';
import cacheManager from '../../services/cache-manager.service';

// Mock dependencies
jest.mock('../../repositories/event.repository');
jest.mock('../../services/cache-manager.service');

describe('AnalyticsService', () => {
  let analyticsService: AnalyticsService;
  let mockEventRepository: jest.Mocked<EventRepository>;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Create service instance
    analyticsService = new AnalyticsService();
    mockEventRepository = (analyticsService as any).eventRepository;
  });

  describe('getAnalyticsSummary', () => {
    const mockQuery = {
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      groupBy: 'day' as const,
    };

    const mockRepositoryData = {
      totalEvents: 1000,
      uniqueUsers: 50,
      eventsByType: [
        { eventtype: 'click', count: '500' },
        { eventtype: 'view', count: '300' },
        { eventtype: 'purchase', count: '200' },
      ],
      timeSeriesData: [
        { timestamp: '2024-01-01T00:00:00Z', count: '100' },
        { timestamp: '2024-01-02T00:00:00Z', count: '150' },
      ],
      topPages: [
        { page: '/home', views: '400' },
        { page: '/products', views: '300' },
      ],
      deviceStats: [
        { device: 'desktop', count: '600' },
        { device: 'mobile', count: '400' },
      ],
    };

    it('should return cached data if available', async () => {
      // Arrange
      const cachedData = { totalEvents: 999, uniqueUsers: 49 };
      (cacheManager.get as jest.Mock).mockResolvedValue(cachedData);

      // Act
      const result = await analyticsService.getAnalyticsSummary(mockQuery);

      // Assert
      expect(result).toEqual(cachedData);
      expect(cacheManager.get).toHaveBeenCalledWith(
        'analytics',
        expect.stringContaining('summary:2024-01-01:2024-01-31:day'),
        expect.any(Object)
      );
      // Should not hit repository if cache exists
      expect(mockEventRepository.getTotalCount).not.toHaveBeenCalled();
    });

    it('should fetch from repository and cache result when cache miss', async () => {
      // Arrange
      (cacheManager.get as jest.Mock).mockResolvedValue(null);
      mockEventRepository.getTotalCount = jest.fn().mockResolvedValue(mockRepositoryData.totalEvents);
      mockEventRepository.getUniqueUserCount = jest.fn().mockResolvedValue(mockRepositoryData.uniqueUsers);
      mockEventRepository.getEventCountByType = jest.fn().mockResolvedValue(mockRepositoryData.eventsByType);
      mockEventRepository.getTimeSeriesData = jest.fn().mockResolvedValue(mockRepositoryData.timeSeriesData);
      mockEventRepository.getTopPages = jest.fn().mockResolvedValue(mockRepositoryData.topPages);
      mockEventRepository.getDeviceStats = jest.fn().mockResolvedValue(mockRepositoryData.deviceStats);

      // Act
      const result = await analyticsService.getAnalyticsSummary(mockQuery);

      // Assert
      expect(result).toEqual({
        totalEvents: 1000,
        uniqueUsers: 50,
        eventsByType: [
          { eventType: 'click', count: 500 },
          { eventType: 'view', count: 300 },
          { eventType: 'purchase', count: 200 },
        ],
        timeSeriesData: [
          { timestamp: '2024-01-01T00:00:00Z', count: 100 },
          { timestamp: '2024-01-02T00:00:00Z', count: 150 },
        ],
        topPages: [
          { page: '/home', views: 400 },
          { page: '/products', views: 300 },
        ],
        deviceStats: [
          { device: 'desktop', count: 600, percentage: 60 },
          { device: 'mobile', count: 400, percentage: 40 },
        ],
      });

      // Verify all repository methods were called
      expect(mockEventRepository.getTotalCount).toHaveBeenCalled();
      expect(mockEventRepository.getUniqueUserCount).toHaveBeenCalled();
      expect(mockEventRepository.getEventCountByType).toHaveBeenCalled();
      expect(mockEventRepository.getTimeSeriesData).toHaveBeenCalled();
      expect(mockEventRepository.getTopPages).toHaveBeenCalled();
      expect(mockEventRepository.getDeviceStats).toHaveBeenCalled();

      // Verify result was cached
      expect(cacheManager.set).toHaveBeenCalledWith(
        'analytics',
        expect.any(String),
        expect.objectContaining({
          totalEvents: 1000,
          uniqueUsers: 50,
        }),
        expect.any(Object)
      );
    });

    it('should skip cache when skipCache is true', async () => {
      // Arrange
      mockEventRepository.getTotalCount = jest.fn().mockResolvedValue(mockRepositoryData.totalEvents);
      mockEventRepository.getUniqueUserCount = jest.fn().mockResolvedValue(mockRepositoryData.uniqueUsers);
      mockEventRepository.getEventCountByType = jest.fn().mockResolvedValue(mockRepositoryData.eventsByType);
      mockEventRepository.getTimeSeriesData = jest.fn().mockResolvedValue(mockRepositoryData.timeSeriesData);
      mockEventRepository.getTopPages = jest.fn().mockResolvedValue(mockRepositoryData.topPages);
      mockEventRepository.getDeviceStats = jest.fn().mockResolvedValue(mockRepositoryData.deviceStats);

      // Act
      await analyticsService.getAnalyticsSummary(mockQuery, undefined, true);

      // Assert
      expect(cacheManager.get).not.toHaveBeenCalled();
      expect(mockEventRepository.getTotalCount).toHaveBeenCalled();
    });

    it('should calculate device stats percentages correctly', async () => {
      // Arrange
      (cacheManager.get as jest.Mock).mockResolvedValue(null);
      mockEventRepository.getTotalCount = jest.fn().mockResolvedValue(1000);
      mockEventRepository.getUniqueUserCount = jest.fn().mockResolvedValue(50);
      mockEventRepository.getEventCountByType = jest.fn().mockResolvedValue([]);
      mockEventRepository.getTimeSeriesData = jest.fn().mockResolvedValue([]);
      mockEventRepository.getTopPages = jest.fn().mockResolvedValue([]);
      mockEventRepository.getDeviceStats = jest.fn().mockResolvedValue([
        { device: 'desktop', count: '750' },
        { device: 'mobile', count: '200' },
        { device: 'tablet', count: '50' },
      ]);

      // Act
      const result = await analyticsService.getAnalyticsSummary(mockQuery);

      // Assert
      expect(result.deviceStats).toEqual([
        { device: 'desktop', count: 750, percentage: 75 },
        { device: 'mobile', count: 200, percentage: 20 },
        { device: 'tablet', count: 50, percentage: 5 },
      ]);
    });

    it('should include tenantId in cache tags for multi-tenant isolation', async () => {
      // Arrange
      (cacheManager.get as jest.Mock).mockResolvedValue(null);
      mockEventRepository.getTotalCount = jest.fn().mockResolvedValue(100);
      mockEventRepository.getUniqueUserCount = jest.fn().mockResolvedValue(10);
      mockEventRepository.getEventCountByType = jest.fn().mockResolvedValue([]);
      mockEventRepository.getTimeSeriesData = jest.fn().mockResolvedValue([]);
      mockEventRepository.getTopPages = jest.fn().mockResolvedValue([]);
      mockEventRepository.getDeviceStats = jest.fn().mockResolvedValue([]);

      // Act
      await analyticsService.getAnalyticsSummary(mockQuery, 'tenant-123');

      // Assert
      expect(cacheManager.set).toHaveBeenCalledWith(
        'analytics',
        expect.any(String),
        expect.any(Object),
        expect.objectContaining({
          tenantId: 'tenant-123',
          tags: expect.arrayContaining(['tenant:tenant-123']),
        })
      );
    });
  });

  describe('clearCache', () => {
    it('should invalidate cache by tenant when tenantId provided', async () => {
      // Arrange
      const tenantId = 'tenant-123';

      // Act
      await analyticsService.clearCache(tenantId);

      // Assert
      expect(cacheManager.invalidateByTenant).toHaveBeenCalledWith(tenantId);
    });

    it('should invalidate entire namespace when no tenantId provided', async () => {
      // Act
      await analyticsService.clearCache();

      // Assert
      expect(cacheManager.invalidateByNamespace).toHaveBeenCalledWith('analytics');
    });
  });

  describe('invalidateCacheForNewEvent', () => {
    it('should invalidate cache with correct tags', async () => {
      // Arrange
      const tenantId = 'tenant-123';
      const eventDate = new Date('2024-01-15T10:30:00Z');

      // Act
      await analyticsService.invalidateCacheForNewEvent(tenantId, eventDate);

      // Assert
      expect(cacheManager.invalidateByTags).toHaveBeenCalledWith(
        expect.arrayContaining([
          'tenant:tenant-123',
          'date:2024-01-15',
          'realtime',
        ])
      );
    });
  });
});

