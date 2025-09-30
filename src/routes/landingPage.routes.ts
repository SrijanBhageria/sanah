import { Router } from 'express';
import {
  createOrUpdateLandingPage,
  getLandingPage,
} from '../controllers/landingPage.controller';
import {
  createLandingPageValidator,
} from '../validators/landingPage.validator';
import { validateBody } from '../middlewares/validate.middleware';

const router = Router();

// POST /landing/createOrUpdatelandingpage - Create or update landing page entry
router.post(
  '/createOrUpdatelandingpage',
  validateBody(createLandingPageValidator),
  createOrUpdateLandingPage,
);

// GET /landing/getlandingpage - Get the landing page entry
router.get(
  '/getlandingpage',
  getLandingPage,
);

export default router;