import { BaseDAO } from './baseDao';
import { InvestmentCard, IInvestmentCardDocument, ISection } from '../models/investmentCard.model';
import { MongoCollection } from '../models/mongodb';
import { logger } from '../logger/logger';
import { generateUuid } from '../utils/idGenerator';

/**
 * Investment Card DAO for database operations
 */
export class InvestmentCardDAO extends BaseDAO<IInvestmentCardDocument> {
  constructor() {
    super(InvestmentCard, MongoCollection.INVESTMENT_CARDS);
  }

  /**
   * Get all investment cards
   */
  async getAllInvestmentCards(): Promise<IInvestmentCardDocument[]> {
    try {
      const cards = await this.findMany({ isDeleted: false });
      return cards;
    } catch (error) {
      // Don't log here - let the service layer handle logging
      throw error;
    }
  }

  /**
   * Get investment card by card ID (only non-deleted cards)
   */
  async getInvestmentCardById(cardId: string): Promise<IInvestmentCardDocument | null> {
    try {
      const card = await this.findOne({ 
        cardId, 
        isDeleted: false 
      });
      return card;
    } catch (error) {
      // Don't log here - let the service layer handle logging
      throw error;
    }
  }

  /**
   * Get investment card by card ID (including deleted cards)
   */
  async getInvestmentCardByIdIncludingDeleted(cardId: string): Promise<IInvestmentCardDocument | null> {
    try {
      const card = await this.findOne({ cardId });
      return card;
    } catch (error) {
      // Don't log here - let the service layer handle logging
      throw error;
    }
  }

  /**
   * Create or update investment card
   */
  async createOrUpdateInvestmentCard(data: Partial<IInvestmentCardDocument>): Promise<IInvestmentCardDocument> {
    try {
      if (data.cardId) {
        // Check for existing card (including deleted ones)
        const existingCard = await this.getInvestmentCardByIdIncludingDeleted(data.cardId);
        
        if (existingCard) {
          // Ensure sections have UUIDs if they don't already
          const processedData = this.processSections(data);
          const updatedCard = await this.update(existingCard._id, processedData);
          if (!updatedCard) {
            throw new Error(`Failed to update investment card with ID: ${data.cardId}`);
          }
          logger.info(`Investment card updated successfully: ${data.cardId}`);
          return updatedCard;
        }
      }
      
      // Create new card
      const processedData = this.processSections(data);
      const cardData = {
        ...processedData,
        cardId: data.cardId || generateUuid(),
      };
      const newCard = await this.create(cardData as IInvestmentCardDocument);
      logger.info(`Investment card created successfully: ${newCard.cardId}`);
      return newCard;
    } catch (error) {
      // Don't log here - let the service layer handle logging
      throw error;
    }
  }

  /**
   * Process sections to ensure they have UUIDs
   */
  private processSections(data: Partial<IInvestmentCardDocument>): Partial<IInvestmentCardDocument> {
    if (!data.sections) {
      return data;
    }

    const processedSections = data.sections.map((section: ISection) => ({
      ...section,
      sectionId: section.sectionId || generateUuid(),
    }));

    return {
      ...data,
      sections: processedSections,
    };
  }

  /**
   * Delete investment card (soft delete)
   */
  async deleteInvestmentCard(cardId: string): Promise<boolean> {
    try {
      const card = await this.getInvestmentCardById(cardId);
      if (!card) {
        return false;
      }

      await this.update(card._id, {
        isDeleted: true,
        deletedAt: new Date(),
      });
      
      logger.info(`Investment card deleted successfully: ${cardId}`);
      return true;
    } catch (error) {
      // Don't log here - let the service layer handle logging
      throw error;
    }
  }

  /**
   * Soft delete investment card by cardId - returns the deleted card
   */
  async softDeleteInvestmentCard(cardId: string): Promise<IInvestmentCardDocument> {
    try {
      const card = await this.model.findOneAndUpdate(
        { cardId, isDeleted: false },
        { 
          isDeleted: true, 
          deletedAt: new Date() 
        },
        { new: true }
      );
      
      if (!card) {
        throw new Error(`Investment card not found: ${cardId}`);
      }
      
      logger.info(`Investment card soft deleted successfully: ${cardId}`);
      return card;
    } catch (error) {
      throw error;
    }
  }
}
