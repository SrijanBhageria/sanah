import { Request, Response, NextFunction } from 'express';
import { LandingPageService } from '../services/landingPage.service';

/**
 * Create or update landing page entry
 */
export const createOrUpdateLandingPage = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const landingPageData = req.body;
    const landingPage = await LandingPageService.createOrUpdateLandingPage(landingPageData);

    res.status(200).json({
      success: true,
      message: 'Landing page created or updated successfully',
      data: landingPage,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get the landing page entry
 */
export const getLandingPage = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const landingPage = await LandingPageService.getLandingPage();

    if (!landingPage) {
      res.status(200).json({
        success: true,
        message: 'No landing page found',
        data: null,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Landing page retrieved successfully',
      data: landingPage,
    });
  } catch (error) {
    next(error);
  }
};