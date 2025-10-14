import { Router } from 'express';
import {
  createOrUpdateInvestmentCard,
  getAllInvestmentCards,
  getInvestmentCardById
} from '../controllers/investmentCard.controller';
import { validateBody, validateQuery } from '../middleware/validate.middleware';
import { createOrUpdateInvestmentCardSchema, cardIdValidator } from '../validators/investmentCard.validator';
import { generalLimiter, pageContentLimiter } from '../middleware/rateLimiter.middleware';
import { securityAuditLogger } from '../middleware/audit.middleware';

const router = Router();

// Apply general rate limiting to all routes
router.use(generalLimiter);

// POST /cards/createOrUpdateInvestmentCard - Create or update investment card
router.post(
  '/createOrUpdateInvestmentCard',
  securityAuditLogger,
  pageContentLimiter,
  validateBody(createOrUpdateInvestmentCardSchema),
  createOrUpdateInvestmentCard,
);

// GET /cards/getAllInvestmentCards - Get all investment cards
router.get(
  '/getAllInvestmentCards',
  getAllInvestmentCards,
);

// GET /cards/getInvestmentCardById?id=cardId - Get investment card by ID
router.get(
  '/getInvestmentCardById',
  validateQuery(cardIdValidator),
  getInvestmentCardById,
);


export { router as investmentCardRoutes };
