import { Request, Response, NextFunction } from 'express';
import { FooterService } from '../services/footer.service';

/**
 * Create or update footer content
 */
export const createOrUpdateFooter = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const footerData = req.body;
    const footer = await FooterService.createOrUpdateFooter(footerData);

    res.status(200).json({
      success: true,
      message: 'Footer content created or updated successfully',
      data: footer,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get footer content
 */
export const getFooter = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const footer = await FooterService.getFooter();

    if (!footer) {
      res.status(200).json({
        success: true,
        message: 'No footer content found',
        data: null,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Footer content retrieved successfully',
      data: footer,
    });
  } catch (error) {
    next(error);
  }
};
