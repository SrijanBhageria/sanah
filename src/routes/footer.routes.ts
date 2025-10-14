import { Router } from 'express';
import { createOrUpdateFooter, getFooter } from '../controllers/footer.controller';
import { validate } from '../middleware/validate.middleware';
import { createOrUpdateFooterSchema } from '../validators/footer.validator';

const router = Router();

/**
 * @route   POST /footer
 * @desc    Create or update footer content
 * @access  Public (can be made private with auth middleware)
 */
router.post('/createOrUpdateFooter', validate(createOrUpdateFooterSchema), createOrUpdateFooter);

/**
 * @route   GET /footer
 * @desc    Get footer content
 * @access  Public
 */
router.get('/getFooter', getFooter);

export { router as footerRoutes };
