import { IBlog } from '../models/blog.model';
import { IBlogType } from '../models/blogType.model';
import { blogDAO, blogTypeDAO } from '../mongodb/index';
import { logger } from '../logger/logger';
import { sanitizeBlogData, sanitizeBlogTypeData } from '../utils/sanitizer';

export interface CreateBlogData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  typeId: string;
  image?: string;
  tags: string[];
  readTime?: number;
  isPublished: boolean;
}

export interface CreateBlogTypeData {
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
}

export interface BlogQueryParams {
  page?: number;
  limit?: number;
  typeId?: string;
  search?: string;
}

/**
 * Calculate estimated reading time in minutes based on content length
 * Assumes average reading speed of 200 words per minute
 */
function calculateReadTime(content: string): number {
  if (!content || typeof content !== 'string') {
    return 1; // Default to 1 minute for empty content
  }
  
  // Remove HTML tags and extra whitespace
  const cleanContent = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  
  // Count words (split by whitespace and filter out empty strings)
  const wordCount = cleanContent.split(/\s+/).filter(word => word.length > 0).length;
  
  // Calculate reading time (200 words per minute)
  const readTime = Math.ceil(wordCount / 200);
  
  // Ensure minimum of 1 minute and maximum of 120 minutes
  return Math.max(1, Math.min(120, readTime));
}

/**
 * Blog service class containing business logic
 */
export class BlogService {
  /**
   * Get all types with their blogs (combined API)
   */
  static async getTypesWithBlogs(limit: number = 5, adminMode: boolean = false): Promise<any[]> {
    try {
      const result = await blogDAO.getTypesWithBlogs(limit, adminMode);
      const mode = adminMode ? 'admin' : 'public';
      logger.info(`Retrieved ${result.length} types with blogs (${mode} mode)`);
      return result;
    } catch (error) {
      logger.error('Error in blog service - getTypesWithBlogs:', error);
      throw error;
    }
  }

  /**
   * Get blogs by type with pagination
   */
  static async getBlogsByType(
    typeId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ blogs: IBlog[]; total: number; totalPages: number }> {
    try {
      const result = await blogDAO.getBlogsByType(typeId, page, limit);
      logger.info(`Retrieved ${result.blogs.length} blogs for type ${typeId}`);
      return result;
    } catch (error) {
      logger.error('Error in blog service - getBlogsByType:', error);
      throw error;
    }
  }

  /**
   * Get blog by ID
   */
  static async getBlogById(blogId: string, adminMode: boolean = false): Promise<IBlog | null> {
    try {
      const result = await blogDAO.getByBlogId(blogId, adminMode);
      if (result) {
        const mode = adminMode ? 'admin' : 'public';
        logger.info(`Retrieved blog with ID: ${blogId} (${mode} mode)`);
      }
      return result;
    } catch (error) {
      logger.error('Error in blog service - getBlogById:', error);
      throw error;
    }
  }

  /**
   * Get all blog types
   */
  static async getBlogTypes(): Promise<IBlogType[]> {
    try {
      const result = await blogTypeDAO.getActiveTypes();
      logger.info(`Retrieved ${result.length} blog types`);
      return result;
    } catch (error) {
      logger.error('Error in blog service - getBlogTypes:', error);
      throw error;
    }
  }

  /**
   * Create a new blog
   */
  static async createBlog(data: CreateBlogData): Promise<IBlog> {
    try {
      // Sanitize input data
      const sanitizedData = sanitizeBlogData(data);
      
      // Calculate read time if not provided
      if (!sanitizedData.readTime && sanitizedData.content) {
        sanitizedData.readTime = calculateReadTime(sanitizedData.content);
      }
      
      const result = await blogDAO.createWithBlogId(sanitizedData);
      logger.info(`Created blog with ID: ${result.blogId}, read time: ${result.readTime} minutes`);
      return result;
    } catch (error) {
      // Don't log here - let the error middleware handle logging
      throw error;
    }
  }

  /**
   * Update a blog
   */
  static async updateBlog(blogId: string, data: Partial<CreateBlogData>): Promise<IBlog | null> {
    try {
      // Sanitize input data
      const sanitizedData = sanitizeBlogData(data);
      
      // Recalculate read time if content is being updated and readTime is not explicitly provided
      if (sanitizedData.content && sanitizedData.readTime === undefined) {
        sanitizedData.readTime = calculateReadTime(sanitizedData.content);
      }
      
      const result = await blogDAO.updateByBlogId(blogId, sanitizedData);
      if (result) {
        logger.info(`Updated blog with ID: ${blogId}, read time: ${result.readTime} minutes`);
      }
      return result;
    } catch (error) {
      // Don't log here - let the error middleware handle logging
      throw error;
    }
  }

  /**
   * Delete a blog
   */
  static async deleteBlog(blogId: string): Promise<boolean> {
    try {
      const result = await blogDAO.deleteByBlogId(blogId);
      if (result) {
        logger.info(`Deleted blog with ID: ${blogId}`);
      }
      return result;
    } catch (error) {
      // Don't log here - let the error middleware handle logging
      throw error;
    }
  }

  /**
   * Create a new blog type
   */
  static async createBlogType(data: CreateBlogTypeData): Promise<IBlogType> {
    try {
      // Sanitize input data
      const sanitizedData = sanitizeBlogTypeData(data);
      const result = await blogTypeDAO.createWithTypeId(sanitizedData);
      logger.info(`Created blog type with ID: ${result.typeId}`);
      return result;
    } catch (error) {
      // Don't log here - let the error middleware handle logging
      throw error;
    }
  }

  /**
   * Update a blog type
   */
  static async updateBlogType(typeId: string, data: Partial<CreateBlogTypeData>): Promise<IBlogType | null> {
    try {
      // Sanitize input data
      const sanitizedData = sanitizeBlogTypeData(data);
      const result = await blogTypeDAO.updateByTypeId(typeId, sanitizedData);
      if (result) {
        logger.info(`Updated blog type with ID: ${typeId}`);
      }
      return result;
    } catch (error) {
      // Don't log here - let the error middleware handle logging
      throw error;
    }
  }

  /**
   * Delete a blog type and all associated blogs (optimized with transaction support)
   */
  static async deleteBlogType(typeId: string): Promise<{ blogTypeDeleted: boolean; deletedBlogIds: string[] }> {
    try {
      // First, get the blog IDs that will be deleted (optimized single query)
      const deletedBlogIds = await blogDAO.deleteBlogsByTypeId(typeId);
      
      // Then delete the blog type
      const blogTypeDeleted = await blogTypeDAO.deleteByTypeId(typeId);
      
      if (!blogTypeDeleted) {
        throw new Error(`Blog type with ID ${typeId} not found or already deleted`);
      }
      
      // Optimized logging - avoid expensive string operations for large arrays
      if (deletedBlogIds.length > 0) {
        const logMessage = deletedBlogIds.length <= 5 
          ? `Deleted blog type ${typeId} and ${deletedBlogIds.length} blogs: ${deletedBlogIds.join(', ')}`
          : `Deleted blog type ${typeId} and ${deletedBlogIds.length} blogs: ${deletedBlogIds.slice(0, 3).join(', ')}... (+${deletedBlogIds.length - 3} more)`;
        logger.info(logMessage);
      } else {
        logger.info(`Deleted blog type ${typeId} (no associated blogs found)`);
      }
      
      return {
        blogTypeDeleted,
        deletedBlogIds
      };
    } catch (error) {
      logger.error(`Error deleting blog type ${typeId}:`, error);
      throw error;
    }
  }
}