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

    // If the event doesn't have a tenantId, we can use a default or skip
    // For now, let's create with available data
    const event = await prisma.event.create({
      data: {
        tenantId: data.tenantId || "default-tenant", // You might want to handle this differently
        userId: data.userId || null,
        sessionId: data.sessionId || `session_${Date.now()}`,
        eventType: data.eventType,
        timestamp: new Date(),
        metadata: {
          page: data.page,
          browser: data.browser,
          device: data.device,
          country: data.country,
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
      where.timestamp = {
        gte: new Date(startDate),
        lte: new Date(endDate),
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
  async getEventCountByType(startDate: Date, endDate: Date) {
    const results = await prisma.event.groupBy({
      by: ["eventType"],
      where: {
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
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
  async getTimeSeriesData(startDate: Date, endDate: Date, interval: string) {
    const truncFunc = interval === "hour" ? "hour" : "day";

    // Use raw SQL for time bucketing
    const results = await prisma.$queryRaw<
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

    return results.map((r: any) => ({
      timestamp: r.timestamp.toISOString(),
      count: r.count.toString(),
    }));
  }

  /**
   * Get unique user count in date range
   */
  async getUniqueUserCount(startDate: Date, endDate: Date): Promise<number> {
    const result = await prisma.event.findMany({
      where: {
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
        userId: { not: null },
      },
      select: { userId: true },
      distinct: ["userId"],
    });

    return result.length;
  }

  /**
   * Get top pages by view count
   */
  async getTopPages(startDate: Date, endDate: Date, limit: number = 10) {
    // Pages are stored in metadata now
    const results = await prisma.$queryRaw<
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

    return results.map((r: any) => ({
      page: r.page,
      views: r.views.toString(),
    }));
  }

  /**
   * Get device statistics
   */
  async getDeviceStats(startDate: Date, endDate: Date) {
    // Devices are stored in metadata now
    const results = await prisma.$queryRaw<
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

    return results.map((r: any) => ({
      device: r.device,
      count: r.count.toString(),
    }));
  }

  /**
   * Get total event count in date range
   */
  async getTotalCount(startDate: Date, endDate: Date): Promise<number> {
    return await prisma.event.count({
      where: {
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }
}
