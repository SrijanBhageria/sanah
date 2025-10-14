import { IFooterDocument } from '../models/footer.model';
import { footerDAO } from '../mongodb/index';
import { logger } from '../logger/logger';
import { sanitizeText } from '../utils/sanitizer';

export type CreateFooterData = Partial<IFooterDocument>;

/**
 * Footer service class containing business logic
 */
export class FooterService {
    

  /**
   * Create or update footer content
   */
  static async createOrUpdateFooter(footerData: CreateFooterData): Promise<IFooterDocument> {
    try {
      // Sanitize input data for XSS protection - only sanitize fields that are provided
      const sanitizedData = {
        ...footerData,
        ...(footerData.companyName && { companyName: sanitizeText(footerData.companyName) }),
        ...(footerData.companyDescription && { companyDescription: sanitizeText(footerData.companyDescription) }),
        ...(footerData.contact && {
          contact: {
            ...(footerData.contact.email && { email: sanitizeText(footerData.contact.email) }),
            ...(footerData.contact.phone && { phone: sanitizeText(footerData.contact.phone) }),
            ...(footerData.contact.address && { address: sanitizeText(footerData.contact.address) }),
          }
        }),
        ...(footerData.sections && {
          sections: footerData.sections.map(section => ({
            ...(section.title && { title: sanitizeText(section.title) }),
            ...(section.links && {
              links: section.links.map(link => ({
                ...(link.text && { text: sanitizeText(link.text) }),
                ...(link.url && { url: sanitizeText(link.url) }),
              }))
            })
          }))
        }),
        ...(footerData.socialMedia && {
          socialMedia: footerData.socialMedia.map(social => ({
            ...(social.platform && { platform: sanitizeText(social.platform) }),
            ...(social.url && { url: sanitizeText(social.url) }),
            ...(social.icon && { icon: sanitizeText(social.icon) }),
          }))
        }),
        ...(footerData.backToTopText && { backToTopText: sanitizeText(footerData.backToTopText) }),
        ...(footerData.copyrightText && { copyrightText: sanitizeText(footerData.copyrightText) }),
        ...(footerData.legalLinks && {
          legalLinks: footerData.legalLinks.map(link => ({
            ...(link.text && { text: sanitizeText(link.text) }),
            ...(link.url && { url: sanitizeText(link.url) }),
          }))
        })
      };

      const footer = await footerDAO.createOrUpdateFooter(sanitizedData as Partial<IFooterDocument>);
      logger.info(`Footer content operation successful: ${footer.companyName}`);
      return footer;
    } catch (error) {
      // Don't log here - let the error middleware handle logging
      throw error;
    }
  }

  /**
   * Get footer content
   */
  static async getFooter(): Promise<IFooterDocument | null> {
    try {
      const footer = await footerDAO.getFooter();
      return footer;
    } catch (error) {
      // Don't log here - let the error middleware handle logging
      throw error;
    }
  }
}
