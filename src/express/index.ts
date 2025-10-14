import * as express from 'express';
import { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from '../config/env';
import { logger } from '../logger/logger';
import { errorHandler, notFoundHandler } from '../middleware/error.middleware';
import { auditLogger } from '../middleware/audit.middleware';

/**
 * Express application setup
 */
const app: Application = express();

// Security middleware
app.use(helmet());

// CORS configuration - Allow all origins for development
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  }),
);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use(
  morgan(':method :url :status :response-time ms - :res[content-length]', {
    stream: {
      write: (message: string) => logger.http(message.trim()),
    },
  }),
);

// Audit logging middleware
app.use(auditLogger);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

// Import routes
import blogRoutes from '../routes/blog.routes';
import pageContentRoutes from '../routes/pageContent.routes';
import { footerRoutes } from '../routes/footer.routes';
import { investmentCardRoutes } from '../routes/investmentCard.routes';

// API routes
app.use('/blog', blogRoutes);
app.use('/page', pageContentRoutes);
app.use('/footer', footerRoutes);
app.use('/cards', investmentCardRoutes);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

/**
 * Start the Express server
 */
export const startServer = (): void => {
  const server = app.listen(env.PORT, () => {
    logger.info(`🚀 Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    logger.info(`📊 Health check: http://localhost:${env.PORT}/health`);
    logger.info(`🔗 Server URL: http://localhost:${env.PORT}`);
  });

  // Handle server errors
  server.on('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE') {
      logger.error(`Port ${env.PORT} is already in use`);
    } else {
      logger.error('Server error:', error);
    }
    process.exit(1);
  });
};

export default app;