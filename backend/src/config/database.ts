import { DataSource } from 'typeorm';
import { Event } from '../entities/Event';
import { Metric } from '../entities/Metric';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'analytics_user',
  password: process.env.DB_PASSWORD || 'analytics_pass',
  database: process.env.DB_NAME || 'analytics_db',
  synchronize: false, // Disabled - schema is managed by Prisma
  logging: process.env.NODE_ENV === 'development',
  entities: [Event, Metric],
  subscribers: [],
  migrations: [],
});

