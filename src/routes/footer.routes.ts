import { Router } from 'express';
import { createOrUpdateFooter, getFooter } from '../controllers/footer.controller';
import { validateBody } from '../middleware/validate.middleware';
import { createOrUpdateFooterSchema } from '../validators/footer.validator';
import { generalLimiter, pageContentLimiter } from '../middleware/rateLimiter.middleware';
import { auditLogger, securityAuditLogger } from '../middleware/audit.middleware';

const router = Router();

// Apply general rate limiting to all routes
router.use(generalLimiter);

/**
 * @route   POST /footer/createOrUpdateFooter
 * @desc    Create or update footer content
 * @access  Public (can be made private with auth middleware)
 */
router.post(
  '/createOrUpdateFooter',
  securityAuditLogger,
  pageContentLimiter,
  validateBody(createOrUpdateFooterSchema),
  createOrUpdateFooter
);

/**
 * @route   GET /footer/getFooter
 * @desc    Get footer content
 * @access  Public
 */
router.get(
  '/getFooter',
  auditLogger,
  getFooter
);

export { router as footerRoutes };
