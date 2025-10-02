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
      const result = await blogDAO.createWithBlogId(sanitizedData);
      logger.info(`Created blog with ID: ${result.blogId}`);
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
      const result = await blogDAO.updateByBlogId(blogId, sanitizedData);
      if (result) {
        logger.info(`Updated blog with ID: ${blogId}`);
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
   * Delete a blog type
   */
  static async deleteBlogType(typeId: string): Promise<boolean> {
    try {
      const result = await blogTypeDAO.deleteByTypeId(typeId);
      if (result) {
        logger.info(`Deleted blog type with ID: ${typeId}`);
      }
      return result;
    } catch (error) {
      // Don't log here - let the error middleware handle logging
      throw error;
    }
  }
}