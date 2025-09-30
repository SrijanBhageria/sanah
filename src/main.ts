import { initializeApp } from './init';
import app from './app';
import { env } from './config/env';
import { logger } from './utils/logger';

/**
 * Main application entry point
 */
const startServer = async (): Promise<void> => {
  try {
    // Initialize all services
    await initializeApp();

    // Start the HTTP server
    const server = app.listen(env.PORT, () => {
      logger.info(`🚀 Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
      logger.info(`📊 Health check: http://localhost:${env.PORT}/health`);
      logger.info(`🔗 Server URL: http://localhost:${env.PORT}`);
    });

    // Handle server errors
    server.on('error', (error) => {
      logger.error('Server error:', error);
      process.exit(1);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the application
startServer();
