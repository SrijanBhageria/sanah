import { LandingPage, ILandingPage } from '../models/landingPage.model';
import { createError } from '../utils/AppError';
import { logger } from '../utils/logger';

export interface CreateLandingPageData {
  header: string;
  subtitle: string;
  numbers: {
    value: string;
    label: string;
  }[];
}

/**
 * Landing Page service class containing business logic
 */
export class LandingPageService {
  /**
   * Create or update landing page entry
   */
  static async createOrUpdateLandingPage(landingPageData: Partial<CreateLandingPageData>): Promise<ILandingPage> {
    try {
      // Check if a landing page entry already exists
      const existingPage = await LandingPage.findOne();
      
      if (existingPage) {
        // Update existing page with only provided fields
        const updatedPage = await LandingPage.findOneAndUpdate(
          {},
          { $set: landingPageData }, // Only update the fields that are provided
          { new: true, runValidators: true }
        );
        logger.info(`Landing page updated successfully: ${updatedPage?.header}`);
        return updatedPage!;
      } else {
        // Create new page - but we need all required fields for creation
        if (!landingPageData.header || !landingPageData.subtitle || !landingPageData.numbers) {
          throw createError.badRequest('All fields (header, subtitle, numbers) are required for creating a new landing page');
        }
        
        const newLandingPage = new LandingPage(landingPageData as CreateLandingPageData);
        await newLandingPage.save();
        logger.info(`Landing page created successfully: ${newLandingPage.header}`);
        return newLandingPage;
      }
    } catch (error) {
      logger.error('Error creating or updating landing page:', error);
      throw error;
    }
  }

  /**
   * Get the landing page entry
   */
  static async getLandingPage(): Promise<ILandingPage | null> {
    try {
      const landingPage = await LandingPage.findOne();
      return landingPage;
    } catch (error) {
      logger.error('Error getting landing page:', error);
      throw error;
    }
  }
}