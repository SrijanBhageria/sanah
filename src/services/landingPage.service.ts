import { ILandingPage } from '../models/landingPage.model';
import { landingPageDAO } from '../mongodb/index';
import { logger } from '../logger/logger';
import { sanitizeText } from '../utils/sanitizer';

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
      // Sanitize input data for XSS protection
      const sanitizedData: Partial<CreateLandingPageData> = {
        ...landingPageData,
        ...(landingPageData.header && { header: sanitizeText(landingPageData.header) }),
        ...(landingPageData.subtitle && { subtitle: sanitizeText(landingPageData.subtitle) }),
        ...(landingPageData.numbers && {
          numbers: landingPageData.numbers.map(num => ({
            value: sanitizeText(num.value),
            label: sanitizeText(num.label)
          }))
        })
      };

      const landingPage = await landingPageDAO.createOrUpdateLandingPage(sanitizedData);
      logger.info(`Landing page operation successful: ${landingPage.header}`);
      return landingPage;
    } catch (error) {
      // Don't log here - let the error middleware handle logging
      throw error;
    }
  }

  /**
   * Get the landing page entry
   */
  static async getLandingPage(): Promise<ILandingPage | null> {
    try {
      const landingPage = await landingPageDAO.getLandingPage();
      return landingPage;
    } catch (error) {
      // Don't log here - let the error middleware handle logging
      throw error;
    }
  }
}