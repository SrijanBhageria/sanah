import { Router } from 'express';
import {
  createOrUpdateLandingPage,
  getLandingPage,
} from '../controllers/landingPage.controller';
import {
  createLandingPageValidator,
} from '../validators/landingPage.validator';
import { validateBody } from '../middleware/validate.middleware';
import { generalLimiter, landingPageLimiter } from '../middleware/rateLimiter.middleware';
import { securityAuditLogger } from '../middleware/audit.middleware';

const router = Router();

// Apply general rate limiting to all routes
router.use(generalLimiter);

// POST /landing/createOrUpdatelandingpage - Create or update landing page entry
router.post(
  '/createOrUpdatelandingpage',
  securityAuditLogger,
  landingPageLimiter,
  validateBody(createLandingPageValidator),
  createOrUpdateLandingPage,
);

// GET /landing/getlandingpage - Get the landing page entry
router.get(
  '/getlandingpage',
  getLandingPage,
);

export default router;