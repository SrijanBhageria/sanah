import { Request, Response, NextFunction } from 'express';
import { InvestmentCardService } from '../services/investmentCard.service';

/**
 * Create or update investment card
 */
export const createOrUpdateInvestmentCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const cardData = req.body;
    const card = await InvestmentCardService.createOrUpdateInvestmentCard(cardData);

    res.status(200).json({
      success: true,
      message: 'Investment card created or updated successfully',
      data: card,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all investment cards
 */
export const getAllInvestmentCards = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const cards = await InvestmentCardService.getAllInvestmentCards();

    res.status(200).json({
      success: true,
      message: 'Investment cards retrieved successfully',
      data: cards,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get investment card by ID
 */
export const getInvestmentCardById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id: cardId } = req.query;
    
    if (!cardId) {
      res.status(400).json({
        success: false,
        message: 'Card ID is required',
        data: null,
      });
      return;
    }

    const card = await InvestmentCardService.getInvestmentCardById(cardId as string);

    if (!card) {
      res.status(404).json({
        success: false,
        message: 'Investment card not found',
        data: null,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Investment card retrieved successfully',
      data: card,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete investment card
 */
