import { PrismaClient, Prisma } from "@prisma/client";
import { CreateEventDto, EventsQueryDto } from "../dtos/event.dto";

const prisma = new PrismaClient();

/**
 * EventRepository - Migrated to Prisma
 *
 * This repository now uses Prisma instead of TypeORM for better performance
 * and type safety. All methods maintain backward compatibility.
 */
export class EventRepository {
  /**
   * Create a new event
   */
  async create(data: CreateEventDto): Promise<any> {
    // For backward compatibility, we need to handle the old Event structure
    // We'll create a basic event and potentially migrate to the new structure

    // Validate that tenantId is provided
    if (!data.tenantId) {
      throw new Error('tenantId is required to create an event');
    }

    // Verify tenant exists
    const tenant = await prisma.tenant.findUnique({
      where: { id: data.tenantId },
    });

    if (!tenant) {
      throw new Error(`Tenant with ID ${data.tenantId} not found. Please seed the database first.`);
    }
    
    // Only use userId if it's a valid UUID format AND the user exists
    const isValidUUID = data.userId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(data.userId);
    
    let validUserId: string | null = null;
    if (isValidUUID && data.userId) {
      // Verify user exists in database
      const userExists = await prisma.user.findUnique({
        where: { id: data.userId },
      });
      
      if (userExists) {
        validUserId = data.userId;
      }
    }

    // Use provided timestamp or default to current time
    const eventTimestamp = data.timestamp ? new Date(data.timestamp) : new Date();

    const event = await prisma.event.create({
      data: {
        tenantId: data.tenantId,
        userId: validUserId, // Only set if user exists in database
        sessionId: data.sessionId || `session_${Date.now()}`,
        eventType: data.eventType,
        timestamp: eventTimestamp,
        metadata: {
          page: data.page,
          browser: data.browser,
          device: data.device,
          country: data.country,
          // Store the user identifier in metadata if not in database
          userIdentifier: data.userId && !validUserId ? data.userId : undefined,
          ...data.metadata,
        },
      },
    });

    return event;
  }

  /**
   * Find all events with pagination and filtering
   */
  async findAll(query: EventsQueryDto): Promise<[any[], number]> {
    const {
      startDate,
      endDate,
      eventType,
      userId,
      page = 1,
      limit = 50,
    } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (startDate && endDate) {
      // Parse dates as UTC to avoid timezone issues
      where.timestamp = {
        gte: new Date(startDate + 'T00:00:00Z'),
        lte: new Date(endDate + 'T00:00:00Z'),
      };
    }
    if (eventType) {
      where.eventType = eventType;
    }
    if (userId) {
      where.userId = userId;
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        orderBy: { timestamp: "desc" },
        skip,
        take: limit,
      }),
      prisma.event.count({ where }),
    ]);

    return [events, total];
  }

  /**
   * Find event by ID
   */
  async findById(id: string): Promise<any | null> {
    return await prisma.event.findUnique({
      where: { id },
    });
  }

  /**
   * Get event count grouped by event type
   */
  async getEventCountByType(startDate: Date, endDate: Date, tenantId?: string) {
    const where: any = {
      timestamp: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (tenantId) {
      where.tenantId = tenantId;
    }

    const results = await prisma.event.groupBy({
      by: ["eventType"],
      where,
      _count: {
        eventType: true,
      },
    });

    // Format to match old TypeORM output
    return results.map((r: any) => ({
      eventtype: r.eventType, // lowercase to match old format
      count: r._count.eventType.toString(),
    }));
  }

  /**
   * Get time series data bucketed by interval
   */
  async getTimeSeriesData(startDate: Date, endDate: Date, interval: string, tenantId?: string) {
    const truncFunc = interval === "hour" ? "hour" : "day";

    // Use raw SQL for time bucketing
    let results;
    if (tenantId) {
      results = await prisma.$queryRaw<
        Array<{ timestamp: Date; count: bigint }>
      >(
        Prisma.sql`
          SELECT 
            DATE_TRUNC(${Prisma.raw(`'${truncFunc}'`)}, timestamp) as timestamp,
            COUNT(*) as count
          FROM events
          WHERE timestamp >= ${startDate}
            AND timestamp <= ${endDate}
            AND "tenantId" = ${tenantId}
          GROUP BY DATE_TRUNC(${Prisma.raw(`'${truncFunc}'`)}, timestamp)
          ORDER BY timestamp ASC
        `
      );
    } else {
      results = await prisma.$queryRaw<
        Array<{ timestamp: Date; count: bigint }>
      >(
        Prisma.sql`
          SELECT 
            DATE_TRUNC(${Prisma.raw(`'${truncFunc}'`)}, timestamp) as timestamp,
            COUNT(*) as count
          FROM events
          WHERE timestamp >= ${startDate}
            AND timestamp <= ${endDate}
          GROUP BY DATE_TRUNC(${Prisma.raw(`'${truncFunc}'`)}, timestamp)
          ORDER BY timestamp ASC
        `
      );
    }

    return results.map((r: any) => ({
      timestamp: r.timestamp.toISOString(),
      count: r.count.toString(),
    }));
  }

  /**
   * Get unique user count in date range
   */
  async getUniqueUserCount(startDate: Date, endDate: Date, tenantId?: string): Promise<number> {
    const where: any = {
      timestamp: {
        gte: startDate,
        lte: endDate,
      },
      userId: { not: null },
    };

    if (tenantId) {
      where.tenantId = tenantId;
    }

    const result = await prisma.event.findMany({
      where,
      select: { userId: true },
      distinct: ["userId"],
    });

    return result.length;
  }

  /**
   * Get top pages by view count
   */
  async getTopPages(startDate: Date, endDate: Date, limit: number = 10, tenantId?: string) {
    // Pages are stored in metadata now
    let results;
    if (tenantId) {
      results = await prisma.$queryRaw<
        Array<{ page: string; views: bigint }>
      >`
        SELECT 
          metadata->>'page' as page,
          COUNT(*) as views
        FROM events
        WHERE timestamp >= ${startDate}
          AND timestamp <= ${endDate}
          AND "tenantId" = ${tenantId}
          AND metadata->>'page' IS NOT NULL
        GROUP BY metadata->>'page'
        ORDER BY views DESC
        LIMIT ${limit}
      `;
    } else {
      results = await prisma.$queryRaw<
        Array<{ page: string; views: bigint }>
      >`
        SELECT 
          metadata->>'page' as page,
          COUNT(*) as views
        FROM events
        WHERE timestamp >= ${startDate}
          AND timestamp <= ${endDate}
          AND metadata->>'page' IS NOT NULL
        GROUP BY metadata->>'page'
        ORDER BY views DESC
        LIMIT ${limit}
      `;
    }

    return results.map((r: any) => ({
      page: r.page,
      views: r.views.toString(),
    }));
  }

  /**
   * Get device statistics
   */
  async getDeviceStats(startDate: Date, endDate: Date, tenantId?: string) {
    // Devices are stored in metadata now
    let results;
    if (tenantId) {
      results = await prisma.$queryRaw<
        Array<{ device: string; count: bigint }>
      >`
        SELECT 
          metadata->>'device' as device,
          COUNT(*) as count
        FROM events
        WHERE timestamp >= ${startDate}
          AND timestamp <= ${endDate}
          AND "tenantId" = ${tenantId}
          AND metadata->>'device' IS NOT NULL
        GROUP BY metadata->>'device'
      `;
    } else {
      results = await prisma.$queryRaw<
        Array<{ device: string; count: bigint }>
      >`
        SELECT 
          metadata->>'device' as device,
          COUNT(*) as count
        FROM events
        WHERE timestamp >= ${startDate}
          AND timestamp <= ${endDate}
          AND metadata->>'device' IS NOT NULL
        GROUP BY metadata->>'device'
      `;
    }

    return results.map((r: any) => ({
      device: r.device,
      count: r.count.toString(),
    }));
  }

  /**
   * Get total event count in date range
   */
  async getTotalCount(startDate: Date, endDate: Date, tenantId?: string): Promise<number> {
    console.log('EventRepository.getTotalCount - Query params:', {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      tenantId,
    });

    const where: any = {
      timestamp: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (tenantId) {
      where.tenantId = tenantId;
    }

    const count = await prisma.event.count({
      where,
    });

    console.log('EventRepository.getTotalCount - Result:', count);
    return count;
  }
}
