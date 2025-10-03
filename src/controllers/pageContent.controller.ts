import { Request, Response, NextFunction } from 'express';
import { PageContentService } from '../services/pageContent.service';
import { PageType } from '../models/pageTypes';

/**
 * Create or update page content
 */
export const createOrUpdatePageContent = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const pageData = req.body;
    const pageContent = await PageContentService.createOrUpdatePageContent(pageData);

    res.status(200).json({
      success: true,
      message: `${pageData.pageType} page content created or updated successfully`,
      data: pageContent,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get page content by page type
 */
export const getPageContent = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { pageType } = req.query;
    
    if (!pageType || typeof pageType !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Page type is required',
        data: null,
      });
      return;
    }

    // Validate page type
    if (!Object.values(PageType).includes(pageType as PageType)) {
      res.status(400).json({
        success: false,
        message: 'Invalid page type. Valid types are: story, leadershipTeam, landing',
        data: null,
      });
      return;
    }

    const pageContent = await PageContentService.getPageContent(pageType as PageType);

    if (!pageContent) {
      res.status(200).json({
        success: true,
        message: `No ${pageType} page content found`,
        data: null,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: `${pageType} page content retrieved successfully`,
      data: pageContent,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all page content
 */
export const getAllPageContent = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const pageContents = await PageContentService.getAllPageContent();

    res.status(200).json({
      success: true,
      message: 'All page content retrieved successfully',
      data: pageContents,
    });
  } catch (error) {
    next(error);
  }
};
