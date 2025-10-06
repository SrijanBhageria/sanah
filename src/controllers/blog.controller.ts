import { Request, Response, NextFunction } from 'express';
import { BlogService } from '../services/blog.service';

/**
 * Get all types with their blogs (combined API)
 */
export const getTypesWithBlogs = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const limit = parseInt(req.query['limit'] as string) || 5;
    const adminMode = req.query['admin'] === 'true';
    const result = await BlogService.getTypesWithBlogs(limit, adminMode);

    const mode = adminMode ? ' (admin mode - includes unpublished)' : '';
    res.status(200).json({
      success: true,
      message: `Types with blogs retrieved successfully${mode}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get blogs by type with pagination
 */
export const getBlogsByType = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const typeId = req.query['typeId'] as string;
    if (!typeId) {
      res.status(400).json({
        success: false,
        message: 'Type ID is required',
        data: null,
      });
      return;
    }
    
    const page = parseInt(req.query['page'] as string) || 1;
    const limit = parseInt(req.query['limit'] as string) || 10;

    const result = await BlogService.getBlogsByType(typeId, page, limit);

    res.status(200).json({
      success: true,
      message: 'Blogs retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get blog by blog ID
 */
export const getBlogByBlogId = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const blogId = req.query['blogId'] as string;
    const adminMode = req.query['admin'] === 'true';
    
    if (!blogId) {
      res.status(400).json({
        success: false,
        message: 'Blog ID is required',
        data: null,
      });
      return;
    }

    const result = await BlogService.getBlogById(blogId, adminMode);

    if (!result) {
      const mode = adminMode ? ' (including unpublished)' : '';
      res.status(404).json({
        success: false,
        message: `Blog not found${mode}`,
        data: null,
      });
      return;
    }

    const mode = adminMode ? ' (admin mode)' : '';
    res.status(200).json({
      success: true,
      message: `Blog retrieved successfully${mode}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all blog types
 */
export const getBlogTypes = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await BlogService.getBlogTypes();

    res.status(200).json({
      success: true,
      message: 'Blog types retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new blog
 */
export const createBlog = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await BlogService.createBlog(req.body);

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a blog
 */
export const updateBlog = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const blogId = req.query['blogId'] as string;
    if (!blogId) {
      res.status(400).json({
        success: false,
        message: 'Blog ID is required',
        data: null,
      });
      return;
    }

    const result = await BlogService.updateBlog(blogId, req.body);

    if (!result) {
      res.status(404).json({
        success: false,
        message: 'Blog not found or could not be updated',
        data: null,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Blog updated successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a blog
 */
export const deleteBlog = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const blogId = req.query['blogId'] as string;
    if (!blogId) {
      res.status(400).json({
        success: false,
        message: 'Blog ID is required',
        data: null,
      });
      return;
    }

    const result = await BlogService.deleteBlog(blogId);

    if (!result) {
      res.status(404).json({
        success: false,
        message: 'Blog not found or already deleted',
        data: null,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new blog type
 */
export const createBlogType = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await BlogService.createBlogType(req.body);

    res.status(201).json({
      success: true,
      message: 'Blog type created successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a blog type
 */
export const updateBlogType = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const typeId = req.query['typeId'] as string;
    if (!typeId) {
      res.status(400).json({
        success: false,
        message: 'Type ID is required',
        data: null,
      });
      return;
    }

    const result = await BlogService.updateBlogType(typeId, req.body);

    if (!result) {
      res.status(404).json({
        success: false,
        message: 'Blog type not found or could not be updated',
        data: null,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Blog type updated successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a blog type and all associated blogs
 */
export const deleteBlogType = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const typeId = req.query['typeId'] as string;
    if (!typeId) {
      res.status(400).json({
        success: false,
        message: 'Type ID is required',
        data: null,
      });
      return;
    }

    const result = await BlogService.deleteBlogType(typeId);

    if (!result.blogTypeDeleted) {
      res.status(404).json({
        success: false,
        message: 'Blog type not found or already deleted',
        data: null,
      });
      return;
    }

    const message = result.deletedBlogIds.length > 0 
      ? `Blog type and ${result.deletedBlogIds.length} associated blogs deleted successfully`
      : 'Blog type deleted successfully (no associated blogs found)';

    res.status(200).json({
      success: true,
      message,
      data: {
        blogTypeDeleted: result.blogTypeDeleted,
        deletedBlogIds: result.deletedBlogIds,
        blogsDeletedCount: result.deletedBlogIds.length,
      },
    });
  } catch (error) {
    next(error);
  }
};