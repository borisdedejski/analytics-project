/**
 * Test Setup
 * 
 * Global test configuration and mocks
 */

// Mock Redis client
jest.mock('../config/redis', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    set: jest.fn(),
    setEx: jest.fn(),
    del: jest.fn(),
    sAdd: jest.fn(),
    sMembers: jest.fn(),
    expire: jest.fn(),
    incr: jest.fn(),
    ttl: jest.fn(),
    info: jest.fn().mockResolvedValue('used_memory:1024'),
    multi: jest.fn(() => ({
      exec: jest.fn().mockResolvedValue([]),
      del: jest.fn(),
    })),
    scan: jest.fn().mockResolvedValue({ cursor: 0, keys: [] }),
  },
  initRedis: jest.fn().mockResolvedValue(undefined),
}));

// Mock Prisma client
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    event: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn(),
    },
    $queryRaw: jest.fn(),
    $disconnect: jest.fn(),
  };

  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});

// Increase timeout for integration tests
jest.setTimeout(10000);

// Global test utilities
global.console = {
  ...console,
  // Suppress console.log in tests (but keep errors)
  log: jest.fn(),
  warn: jest.fn(),
};

