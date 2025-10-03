import { BaseDAO } from './baseDao';
import { PageContent, IPageContentDocument } from '../models/pageContent.model';
import { MongoCollection } from '../models/mongodb';
import { PageType } from '../models/pageTypes';
import { logger } from '../logger/logger';
import { generateUuid } from '../utils/idGenerator';

/**
 * Page Content DAO for database operations
 */
export class PageContentDAO extends BaseDAO<IPageContentDocument> {
  constructor() {
    super(PageContent, MongoCollection.PAGE_CONTENT);
  }

  /**
   * Get page content by page type
   */
  async getPageContent(pageType: PageType): Promise<IPageContentDocument | null> {
    try {
      const pageContent = await this.findOne({ 
        pageType, 
        isDeleted: false 
      });
      return pageContent;
    } catch (error) {
      // Don't log here - let the service layer handle logging
      throw error;
    }
  }

  /**
   * Create or update page content
   * Since there should only be one page content per page type, this method handles both creation and updates
   */
  async createOrUpdatePageContent(data: Partial<IPageContentDocument>): Promise<IPageContentDocument> {
    try {
      if (!data.pageType) {
        throw new Error('Page type is required');
      }

      const existingPage = await this.getPageContent(data.pageType);
      
      if (existingPage) {
        // Update existing page
        const updatedPage = await this.update(existingPage._id, data);
        if (!updatedPage) {
          throw new Error(`Failed to update ${data.pageType} page content`);
        }
        logger.info(`${data.pageType} page content updated successfully`);
        return updatedPage;
      } else {
        // Create new page
        const pageData = {
          ...data,
          pageContentId: generateUuid(),
        };
        const newPage = await this.create(pageData as IPageContentDocument);
        logger.info(`${data.pageType} page content created successfully`);
        return newPage;
      }
    } catch (error) {
      // Don't log here - let the service layer handle logging
      throw error;
    }
  }

  /**
   * Get all page content types
   */
  async getAllPageContent(): Promise<IPageContentDocument[]> {
    try {
      const pageContents = await this.findMany({ isDeleted: false });
      return pageContents;
    } catch (error) {
      // Don't log here - let the service layer handle logging
      throw error;
    }
  }
}
