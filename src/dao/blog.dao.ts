import { BaseDAO } from './baseDao';
import { Blog, IBlog } from '../models/blog.model';
import { BlogType } from '../models/blogType.model';
import { MongoCollection } from '../models/mongodb';
import { logger } from '../logger/logger';
import { generateUuid } from '../utils/idGenerator';

/**
 * Blog DAO for database operations
 */
export class BlogDAO extends BaseDAO<IBlog> {
  constructor() {
    super(Blog, MongoCollection.BLOGS);
  }

  /**
   * Get published blogs by type with pagination
   */
  async getBlogsByType(
    typeId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ blogs: IBlog[]; total: number; totalPages: number }> {
    try {
      const skip = (page - 1) * limit;
      
      const [blogs, total] = await Promise.all([
        this.model.find({
          typeId,
          isPublished: true,
          isDeleted: false,
        })
          .sort({ publishedAt: -1 })
          .skip(skip)
          .limit(limit),
        this.count({ typeId, isPublished: true, isDeleted: false }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        blogs,
        total,
        totalPages,
      };
    } catch (error) {
      // Don't log here - let the service layer handle logging
      throw error;
    }
  }

  /**
   * Get all types with their blogs using MongoDB aggregation
   * This is the main method for the combined API
   */
  async getTypesWithBlogs(limit: number = 5, adminMode: boolean = false): Promise<any[]> {
    try {
      const pipeline = [
        // Match only active and non-deleted blog types
        {
          $match: { isActive: true, isDeleted: false }
        },
        // Lookup blogs for each type
        {
          $lookup: {
            from: 'blogs',
            let: { typeId: '$typeId' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$typeId', '$$typeId'] },
                  isDeleted: false,
                  ...(adminMode ? {} : { isPublished: true })
                }
              },
              { $sort: { publishedAt: -1 } },
              { $limit: limit },
              {
                $project: {
                  _id: 1,
                  blogId: 1,
                  title: 1,
                  slug: 1,
                  excerpt: 1,
                  author: 1,
                  image: 1,
                  tags: 1,
                  publishedAt: 1,
                  viewCount: 1
                }
              }
            ],
            as: 'blogs'
          }
        },
        // Project only needed fields
        {
          $project: {
            _id: 1,
            typeId: 1,
            name: 1,
            slug: 1,
            description: 1,
            blogs: 1
          }
        },
        // Sort by name
        { $sort: { name: 1 } }
      ];

      const result = await BlogType.aggregate(pipeline as any);
      return result;
    } catch (error) {
      // Don't log here - let the service layer handle logging
      throw error;
    }
  }

  /**
   * Get published blogs with pagination
   */
  async getPublishedBlogs(
    page: number = 1,
    limit: number = 10,
    typeId?: string
  ): Promise<{ blogs: IBlog[]; total: number; totalPages: number }> {
    try {
      const skip = (page - 1) * limit;
      const filter: any = { isPublished: true, isDeleted: false };
      
      if (typeId) {
        filter.typeId = typeId;
      }

      const [blogs, total] = await Promise.all([
        this.model.find(filter)
          .sort({ publishedAt: -1 })
          .skip(skip)
          .limit(limit),
        this.count(filter),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        blogs,
        total,
        totalPages,
      };
    } catch (error) {
      logger.error('Error getting published blogs:', error);
      throw error;
    }
  }

  /**
   * Get blog by blogId
   */
  async getByBlogId(blogId: string, adminMode: boolean = false): Promise<IBlog | null> {
    try {
      const filter: any = { blogId, isDeleted: false };
      if (!adminMode) {
        filter.isPublished = true;
      }
      const blog = await this.findOne(filter);
      return blog;
    } catch (error) {
      logger.error(`Error getting blog by blogId ${blogId}:`, error);
      throw error;
    }
  }

  /**
   * Get blog by slug
   */
  async getBySlug(slug: string): Promise<IBlog | null> {
    try {
      const blog = await this.findOne({ slug, isPublished: true, isDeleted: false });
      return blog;
    } catch (error) {
      logger.error(`Error getting blog by slug ${slug}:`, error);
      throw error;
    }
  }

  /**
   * Create a new blog with auto-generated blogId
   */
  async createWithBlogId(data: Partial<IBlog>): Promise<IBlog> {
    try {
      const blogData = {
        ...data,
        blogId: generateUuid(),
      };
      const result = await this.create(blogData);
      return result;
    } catch (error) {
      // Don't log here - let the service layer handle logging
      throw error;
    }
  }

  /**
   * Update blog by blogId
   */
  async updateByBlogId(blogId: string, data: Partial<IBlog>): Promise<IBlog | null> {
    try {
      const result = await this.model.findOneAndUpdate(
        { blogId },
        { $set: data },
        { new: true }
      );
      return result;
    } catch (error) {
      // Don't log here - let the service layer handle logging
      throw error;
    }
  }

  /**
   * Soft delete blog by blogId
   */
  async deleteByBlogId(blogId: string): Promise<boolean> {
    try {
      const result = await this.model.findOneAndUpdate(
        { blogId, isDeleted: false },
        { 
          $set: { 
            isDeleted: true, 
            deletedAt: new Date(Date.now()) 
          } 
        },
        { new: true }
      );
      return !!result;
    } catch (error) {
      // Don't log here - let the service layer handle logging
      throw error;
    }
  }

  /**
   * Increment view count for a blog
   */
  async incrementViewCount(blogId: string): Promise<void> {
    try {
      await this.model.findOneAndUpdate(
        { blogId },
        { $inc: { viewCount: 1 } }
      );
    } catch (error) {
      logger.error(`Error incrementing view count for blog ${blogId}:`, error);
      throw error;
    }
  }

  /**
   * Search blogs by text
   */
  async searchBlogs(
    searchTerm: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ blogs: IBlog[]; total: number; totalPages: number }> {
    try {
      const skip = (page - 1) * limit;
      
      const [blogs, total] = await Promise.all([
        this.model.find(
          {
            $text: { $search: searchTerm },
            isPublished: true,
            isDeleted: false
          },
          { score: { $meta: 'textScore' } }
        )
          .sort({ score: { $meta: 'textScore' } })
          .skip(skip)
          .limit(limit),
        this.model.countDocuments({
          $text: { $search: searchTerm },
          isPublished: true,
          isDeleted: false
        }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        blogs,
        total,
        totalPages,
      };
    } catch (error) {
      logger.error(`Error searching blogs with term "${searchTerm}":`, error);
      throw error;
    }
  }
}
