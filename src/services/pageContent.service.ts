import { IPageContentDocument } from '../models/pageContent.model';
import { PageType } from '../models/pageTypes';
import { pageContentDAO } from '../mongodb/index';
import { logger } from '../logger/logger';
import { sanitizeText } from '../utils/sanitizer';

export interface CreatePageContentData {
  pageType: PageType;
  title?: string;
  slug?: string;
  content?: string;
  subtitle?: string;
  items?: Array<{ title: string; description: string }>;
  numbers?: Array<{ value: string; label: string }>;
  btnTxt?: Array<{ buttonText: string }>;
}

/**
 * Page Content service class containing business logic
 */
export class PageContentService {

  /**
   * Create or update page content
   */
  static async createOrUpdatePageContent(pageData: CreatePageContentData): Promise<IPageContentDocument> {
    try {
      // Sanitize input data for XSS protection
      const sanitizedData: CreatePageContentData = {
        ...pageData,
        ...(pageData.title && { title: sanitizeText(pageData.title) }),
        ...(pageData.slug && { slug: sanitizeText(pageData.slug) }),
        ...(pageData.content && { content: sanitizeText(pageData.content) }),
        ...(pageData.subtitle && { subtitle: sanitizeText(pageData.subtitle) }),
        ...(pageData.items && {
          items: pageData.items.map(item => ({
            title: sanitizeText(item.title),
            description: sanitizeText(item.description)
          }))
        }),
        ...(pageData.numbers && {
          numbers: pageData.numbers.map(number => ({
            value: sanitizeText(number.value),
            label: sanitizeText(number.label)
          }))
        }),
        ...(pageData.btnTxt && {
          btnTxt: pageData.btnTxt.map(button => ({
            buttonText: sanitizeText(button.buttonText)
          }))
        })
      };

      const pageContent = await pageContentDAO.createOrUpdatePageContent(sanitizedData);
      logger.info(`Page content operation successful: ${pageContent.pageType} - ${pageContent.title || 'Untitled'}`);
      return pageContent;
    } catch (error) {
      // Don't log here - let the error middleware handle logging
      throw error;
    }
  }

  /**
   * Get page content by page type
   */
  static async getPageContent(pageType: PageType): Promise<IPageContentDocument | null> {
    try {
      const pageContent = await pageContentDAO.getPageContent(pageType);
      return pageContent;
    } catch (error) {
      // Don't log here - let the error middleware handle logging
      throw error;
    }
  }

  /**
   * Get all page content
   */
  static async getAllPageContent(): Promise<IPageContentDocument[]> {
    try {
      const pageContents = await pageContentDAO.getAllPageContent();
      return pageContents;
    } catch (error) {
      // Don't log here - let the error middleware handle logging
      throw error;
    }
  }
}
