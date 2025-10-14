import mongoose from 'mongoose';
import { env } from '../config/env';
import { logger } from '../logger/logger';
import { COLLECTION_CONFIG } from '../models/mongodb';

// Import DAOs
import { BlogTypeDAO } from '../dao/blogType.dao.js';
import { BlogDAO } from '../dao/blog.dao.js';
import { PageContentDAO } from '../dao/pageContent.dao.js';
import { FooterDAO } from '../dao/footer.dao.js';
import { InvestmentCardDAO } from '../dao/investmentCard.dao.js';

/**
 * MongoDB connection configuration
 */
const mongoConfig = {
  uri: env.MONGODB_URI,
  options: {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5050,
    socketTimeoutMS: 45050,
  },
};

/**
 * DAO instances - will be initialized after connection
 */
export let blogTypeDAO: BlogTypeDAO;
export let blogDAO: BlogDAO;
export let pageContentDAO: PageContentDAO;
export let footerDAO: FooterDAO;
export let investmentCardDAO: InvestmentCardDAO;

/**
 * Connect to MongoDB
 */
export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(mongoConfig.uri, mongoConfig.options);
    
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });

  } catch (error) {
    logger.error('MongoDB connection failed:', error);
    throw error;
  }
};

/**
 * Initialize all collections and DAOs
 */
export const initializeCollections = async (): Promise<void> => {
  try {
    logger.info('Initializing collections and DAOs...');

    // Initialize DAOs
    blogTypeDAO = new BlogTypeDAO();
    blogDAO = new BlogDAO();
    pageContentDAO = new PageContentDAO();
    footerDAO = new FooterDAO();
    investmentCardDAO = new InvestmentCardDAO();

    // Initialize collections
    await Promise.all(
      COLLECTION_CONFIG.map(async (config) => {
        try {
          // Create indexes if defined
          if (config.createIndexes) {
            await config.createIndexes();
            logger.info(`Created indexes for collection: ${config.name}`);
          }

          // Initialize default data if defined
          if (config.initializeDefaultData) {
            await config.initializeDefaultData();
            logger.info(`Initialized default data for collection: ${config.name}`);
          }
        } catch (error) {
          logger.error(`Error initializing collection ${config.name}:`, error);
          throw error;
        }
      })
    );

    logger.info('All collections and DAOs initialized successfully');
  } catch (error) {
    logger.error('Error initializing collections:', error);
    throw error;
  }
};

/**
 * Disconnect from MongoDB
 */
export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB disconnected');
  } catch (error) {
    logger.error('Error disconnecting from MongoDB:', error);
    throw error;
  }
};

/**
 * Get MongoDB connection status
 */
export const getConnectionStatus = (): string => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  return states[mongoose.connection.readyState as keyof typeof states] || 'unknown';
};