import { IInvestmentCardDocument, ISection } from '../models/investmentCard.model';
import { investmentCardDAO } from '../mongodb/index';
import { logger } from '../logger/logger';
import { sanitizeText } from '../utils/sanitizer';

export type CreateInvestmentCardData = Partial<IInvestmentCardDocument>;

/**
 * Investment Card service class containing business logic
 */
export class InvestmentCardService {

  /**
   * Create or update investment card (supports soft delete)
   */
  static async createOrUpdateInvestmentCard(cardData: CreateInvestmentCardData): Promise<IInvestmentCardDocument> {
    try {
      // Handle soft delete operation
      if (cardData.isDeleted === true && cardData.cardId) {
        const deletedCard = await investmentCardDAO.softDeleteInvestmentCard(cardData.cardId);
        logger.info(`Investment card deleted successfully: ${deletedCard.companyName} - ${deletedCard.cardId}`);
        return deletedCard;
      }

      // Handle create/update operations
      // Sanitize input data for XSS protection - only sanitize fields that are provided
      const sanitizedData = {
        ...cardData,
        ...(cardData.companyName && { companyName: sanitizeText(cardData.companyName) }),
        ...(cardData.companyLogo && { companyLogo: sanitizeText(cardData.companyLogo) }),
        ...(cardData.sections && {
          sections: this.sanitizeSections(cardData.sections)
        })
      };

      const card = await investmentCardDAO.createOrUpdateInvestmentCard(sanitizedData as Partial<IInvestmentCardDocument>);
      logger.info(`Investment card operation successful: ${card.companyName} - ${card.cardId}`);
      return card;
    } catch (error) {
      // Don't log here - let the error middleware handle logging
      throw error;
    }
  }

  /**
   * Sanitize sections data for XSS protection
   */
  private static sanitizeSections(sections: ISection[]): ISection[] {
    return sections.map(section => ({
      ...section,
      ...(section.title && { title: sanitizeText(section.title) }),
      ...(section.content && { content: this.sanitizeContent(section.content) })
    }));
  }

  /**
   * Sanitize content based on its type
   */
  private static sanitizeContent(content: any): any {
    if (typeof content === 'string') {
      return sanitizeText(content);
    } else if (Array.isArray(content)) {
      return content.map(item => {
        if (typeof item === 'string') {
          return sanitizeText(item);
        } else if (typeof item === 'object' && item !== null) {
          // Handle objects like {item: "text"}
          const sanitizedItem: any = {};
          for (const [key, value] of Object.entries(item)) {
            if (typeof value === 'string') {
              sanitizedItem[key] = sanitizeText(value);
            } else {
              sanitizedItem[key] = value;
            }
          }
          return sanitizedItem;
        }
        return item;
      });
    } else if (typeof content === 'object' && content !== null) {
      // Handle objects
      const sanitizedContent: any = {};
      for (const [key, value] of Object.entries(content)) {
        if (typeof value === 'string') {
          sanitizedContent[key] = sanitizeText(value);
        } else {
          sanitizedContent[key] = value;
        }
      }
      return sanitizedContent;
    }
    return content;
  }

  /**
   * Get all investment cards
   */
  static async getAllInvestmentCards(): Promise<IInvestmentCardDocument[]> {
    try {
      const cards = await investmentCardDAO.getAllInvestmentCards();
      return cards;
    } catch (error) {
      // Don't log here - let the error middleware handle logging
      throw error;
    }
  }

  /**
   * Get investment card by ID
   */
  static async getInvestmentCardById(cardId: string): Promise<IInvestmentCardDocument | null> {
    try {
      const card = await investmentCardDAO.getInvestmentCardById(cardId);
      return card;
    } catch (error) {
      // Don't log here - let the error middleware handle logging
      throw error;
    }
  }

}
