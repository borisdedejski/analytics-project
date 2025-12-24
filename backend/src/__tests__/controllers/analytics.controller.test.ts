/**
 * Analytics Controller Tests
 *
 * Tests HTTP layer for analytics endpoints
 */

import { Request, Response } from "express";
import { EnhancedAnalyticsController } from "../../controllers/enhanced-analytics.controller";
import { AnalyticsService } from "../../services/analytics.service";

// Mock dependencies
jest.mock("../../services/analytics.service");
jest.mock("../../services/circuit-breaker.service", () => ({
  analyticsCircuitBreaker: {
    execute: jest.fn((fn) => fn()),
    getStats: jest.fn(() => ({
      state: "CLOSED",
      failureCount: 0,
      successCount: 100,
    })),
  },
  highLoadHandler: {
    shouldAcceptRequest: jest.fn(() => true),
    getMetrics: jest.fn(() => ({
      level: "NORMAL",
      requestsPerSecond: 10,
      avgResponseTime: 50,
    })),
    recordRequest: jest.fn(),
  },
}));

describe("EnhancedAnalyticsController", () => {
  let controller: EnhancedAnalyticsController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockAnalyticsService: jest.Mocked<AnalyticsService>;

  beforeEach(() => {
    jest.clearAllMocks();

    controller = new EnhancedAnalyticsController();
    mockAnalyticsService = (controller as any).analyticsService;

    mockRequest = {
      query: {},
      headers: {},
    };

    mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
  });

  describe("getSummary", () => {
    it("should return analytics summary successfully", async () => {
      // Arrange
      mockRequest.query = {
        startDate: "2024-01-01",
        endDate: "2024-01-31",
        groupBy: "day",
      };

      const mockSummary = {
        totalEvents: 1000,
        uniqueUsers: 50,
        eventsByType: [],
        timeSeriesData: [],
        topPages: [],
        deviceStats: [],
      };

      mockAnalyticsService.getAnalyticsSummary = jest
        .fn()
        .mockResolvedValue(mockSummary);

      // Act
      await controller.getSummary(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          totalEvents: 1000,
          uniqueUsers: 50,
          _metadata: expect.objectContaining({
            loadLevel: "NORMAL",
          }),
        })
      );
    });

    it("should return 400 when startDate is missing", async () => {
      // Arrange
      mockRequest.query = {
        endDate: "2024-01-31",
      };

      // Act
      await controller.getSummary(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "startDate and endDate are required",
      });
    });

    it("should return 400 when endDate is missing", async () => {
      // Arrange
      mockRequest.query = {
        startDate: "2024-01-01",
      };

      // Act
      await controller.getSummary(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "startDate and endDate are required",
      });
    });

    it("should pass tenantId from headers to service", async () => {
      // Arrange
      mockRequest.query = {
        startDate: "2024-01-01",
        endDate: "2024-01-31",
      };
      mockRequest.headers = {
        "x-tenant-id": "tenant-123",
      };

      mockAnalyticsService.getAnalyticsSummary = jest.fn().mockResolvedValue({
        totalEvents: 0,
        uniqueUsers: 0,
        eventsByType: [],
        timeSeriesData: [],
        topPages: [],
        deviceStats: [],
      });

      // Act
      await controller.getSummary(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockAnalyticsService.getAnalyticsSummary).toHaveBeenCalledWith(
        expect.any(Object),
        "tenant-123",
        false
      );
    });

    it("should handle errors gracefully", async () => {
      // Arrange
      mockRequest.query = {
        startDate: "2024-01-01",
        endDate: "2024-01-31",
      };

      mockAnalyticsService.getAnalyticsSummary = jest
        .fn()
        .mockRejectedValue(new Error("Database connection failed"));

      // Act
      await controller.getSummary(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "Failed to fetch analytics summary",
        })
      );
    });
  });

  describe("healthCheck", () => {
    it("should return healthy status when system is healthy", async () => {
      // Act
      await controller.healthCheck(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "healthy",
          metrics: expect.any(Object),
        })
      );
    });
  });
});
