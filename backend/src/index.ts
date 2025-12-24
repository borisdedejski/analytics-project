import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { AppDataSource } from './config/database';
import { initRedis } from './config/redis';
import eventRoutes from './routes/event.routes';
import analyticsRoutes from './routes/analytics.routes';
import enhancedAnalyticsRoutes from './routes/enhanced-analytics.routes';
import tenantAnalyticsRoutes from './routes/tenant-analytics.routes';
import userRoutes from './routes/user.routes';
import { errorHandler } from './middleware/errorHandler';
import { apiRateLimiter, eventRateLimiter } from './middleware/rateLimiter';

const app = express();
const PORT = process.env.PORT || 3001;

// Legacy rate limiter (keep for backwards compatibility)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
});

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Routes with enhanced scalability features
// Use new rate limiters for better performance
app.use('/api/events', eventRateLimiter.middleware(), eventRoutes);
app.use('/api/analytics', enhancedAnalyticsRoutes); // Enhanced routes with built-in rate limiting
app.use('/api/analytics/legacy', analyticsRoutes); // Legacy routes
app.use('/api/tenants', apiRateLimiter.middleware(), tenantAnalyticsRoutes);
app.use('/api/users', apiRateLimiter.middleware(), userRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use(errorHandler);

const startServer = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connected');

    await initRedis();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

