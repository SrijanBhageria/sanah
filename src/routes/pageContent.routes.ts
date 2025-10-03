import { Router } from 'express';
import {
  createOrUpdatePageContent,
  getPageContent,
  getAllPageContent,
} from '../controllers/pageContent.controller';
import {
  createPageContentValidator,
  pageTypeQueryValidator,
} from '../validators/pageContent.validator';
import { validateBody, validateQuery } from '../middleware/validate.middleware';
import { generalLimiter, pageContentLimiter } from '../middleware/rateLimiter.middleware';
import { securityAuditLogger } from '../middleware/audit.middleware';

const router = Router();

// Apply general rate limiting to all routes
router.use(generalLimiter);

// POST /page/createOrUpdatePageContent - Create or update page content
router.post(
  '/createOrUpdatePageContent',
  securityAuditLogger,
  pageContentLimiter,
  validateBody(createPageContentValidator),
  createOrUpdatePageContent,
);

// GET /page/getPageContent?pageType=story - Get page content by type
router.get(
  '/getPageContent',
  validateQuery(pageTypeQueryValidator),
  getPageContent,
);

// GET /page/getAllPageContent - Get all page content
router.get(
  '/getAllPageContent',
  getAllPageContent,
);

export default router;
