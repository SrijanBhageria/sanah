import { BaseDAO } from './baseDao';
import { LandingPage, ILandingPage } from '../models/landingPage.model';
import { MongoCollection } from '../models/mongodb';
import { logger } from '../logger/logger';

/**
 * Landing Page DAO for database operations
 */
export class LandingPageDAO extends BaseDAO<ILandingPage> {
  constructor() {
    super(LandingPage, MongoCollection.LANDING_PAGE);
  }

  /**
   * Get the landing page (there should only be one)
   */
  async getLandingPage(): Promise<ILandingPage | null> {
    try {
      const landingPage = await this.findOne({});
      return landingPage;
    } catch (error) {
      logger.error('Error getting landing page:', error);
      throw error;
    }
  }

  /**
   * Create or update landing page
   * Since there should only be one landing page, this method handles both creation and updates
   */
  async createOrUpdateLandingPage(data: Partial<ILandingPage>): Promise<ILandingPage> {
    try {
      const existingPage = await this.getLandingPage();
      
      if (existingPage) {
        // Update existing page
        const updatedPage = await this.update(existingPage._id, data);
        if (!updatedPage) {
          throw new Error('Failed to update landing page');
        }
        logger.info('Landing page updated successfully');
        return updatedPage;
      } else {
        // Create new page
        if (!data.header || !data.subtitle || !data.numbers) {
          throw new Error('All fields (header, subtitle, numbers) are required for creating a new landing page');
        }
        const newPage = await this.create(data as ILandingPage);
        logger.info('Landing page created successfully');
        return newPage;
      }
    } catch (error) {
      logger.error('Error creating or updating landing page:', error);
      throw error;
    }
  }
}
