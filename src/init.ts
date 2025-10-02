import { connectDB, initializeCollections } from './mongodb/index';
import { logger } from './logger/logger';

/**
 * Main application entry point
 * Initializes all services and starts the server
 */
const main = async (): Promise<void> => {
  try {
    logger.info('Starting application initialization...');

    // Step 1: Connect to MongoDB
    logger.info('Connecting to MongoDB...');
    await connectDB();
    logger.info('MongoDB connected successfully');

    // Step 2: Initialize collections and DAOs
    logger.info('Initializing collections and DAOs...');
    await initializeCollections();
    logger.info('Collections and DAOs initialized successfully');

    // Step 3: Start Express server
    logger.info('Starting Express server...');
    const { startServer } = await import('./express/index');
    startServer();

    logger.info('Application initialization completed successfully');
  } catch (error) {
    logger.error('Failed to initialize application:', error);
    process.exit(1);
  }
};

/**
 * Graceful shutdown handler
 */
const gracefulShutdown = async (): Promise<void> => {
  try {
    logger.info('Starting graceful shutdown...');
    
    // Close database connections
    const { disconnectDB } = await import('./mongodb/index');
    await disconnectDB();
    
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

// Start the application
main();