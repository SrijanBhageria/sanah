import { connectDB } from './config/db';
import { logger } from './utils/logger';

/**
 * Initialize all services and connections
 */
export const initializeApp = async (): Promise<void> => {
  try {
    logger.info('Starting application initialization...');

    // Connect to MongoDB
    logger.info('Connecting to MongoDB...');
    await connectDB();
    logger.info('MongoDB connected successfully');

    // Add other initializations here
    // await initializeRedis();
    // await initializeEmailService();
    // await initializeFileStorage();

    logger.info('Application initialization completed successfully');
  } catch (error) {
    logger.error('Failed to initialize application:', error);
    process.exit(1);
  }
};

/**
 * Graceful shutdown handler
 */
export const gracefulShutdown = async (): Promise<void> => {
  try {
    logger.info('Starting graceful shutdown...');
    
    // Close database connections
    // await mongoose.connection.close();
    
    // Close other services
    // await redisClient.quit();
    
    logger.info('Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    logger.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
};

// Handle process signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
