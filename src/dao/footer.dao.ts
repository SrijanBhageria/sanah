import { BaseDAO } from './baseDao';
import { Footer, IFooterDocument } from '../models/footer.model';
import { MongoCollection } from '../models/mongodb';
import { logger } from '../logger/logger';
import { generateUuid } from '../utils/idGenerator';

/**
 * Footer DAO for database operations
 */
export class FooterDAO extends BaseDAO<IFooterDocument> {
  constructor() {
    super(Footer, MongoCollection.FOOTER);
  }

  /**
   * Get footer content
   * Since there should only be one footer, this method gets the active footer
   */
  async getFooter(): Promise<IFooterDocument | null> {
    try {
      const footer = await this.findOne({ 
        isDeleted: false 
      });
      return footer;
    } catch (error) {
      // Don't log here - let the service layer handle logging
      throw error;
    }
  }

  /**
   * Create or update footer content
   * Since there should only be one footer, this method handles both creation and updates
   */
  async createOrUpdateFooter(data: Partial<IFooterDocument>): Promise<IFooterDocument> {
    try {
      const existingFooter = await this.getFooter();
      
      if (existingFooter) {
        // Update existing footer
        const updatedFooter = await this.update(existingFooter._id, data);
        if (!updatedFooter) {
          throw new Error('Failed to update footer content');
        }
        logger.info('Footer content updated successfully');
        return updatedFooter;
      } else {
        // Create new footer
        const footerData = {
          ...data,
          footerId: generateUuid(),
        };
        const newFooter = await this.create(footerData as IFooterDocument);
        logger.info('Footer content created successfully');
        return newFooter;
      }
    } catch (error) {
      // Don't log here - let the service layer handle logging
      throw error;
    }
  }
}
