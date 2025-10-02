import { BaseDAO } from './baseDao';
import { BlogType, IBlogType } from '../models/blogType.model';
import { MongoCollection } from '../models/mongodb';
import { logger } from '../logger/logger';
import { generateUuid } from '../utils/idGenerator';

/**
 * Blog Type DAO for database operations
 */
export class BlogTypeDAO extends BaseDAO<IBlogType> {
  constructor() {
    super(BlogType, MongoCollection.BLOG_TYPES);
  }

  /**
   * Get all active blog types
   */
  async getActiveTypes(): Promise<IBlogType[]> {
    try {
      const types = await this.findMany({ isActive: true, isDeleted: false });
      return types;
    } catch (error) {
      logger.error('Error getting active blog types:', error);
      throw error;
    }
  }

  /**
   * Get blog type by slug
   */
  async getBySlug(slug: string): Promise<IBlogType | null> {
    try {
      const type = await this.findOne({ slug, isActive: true, isDeleted: false });
      return type;
    } catch (error) {
      logger.error(`Error getting blog type by slug ${slug}:`, error);
      throw error;
    }
  }

  /**
   * Get blog type by typeId
   */
  async getByTypeId(typeId: string): Promise<IBlogType | null> {
    try {
      const type = await this.findOne({ typeId, isActive: true, isDeleted: false });
      return type;
    } catch (error) {
      logger.error(`Error getting blog type by typeId ${typeId}:`, error);
      throw error;
    }
  }

  /**
   * Create a new blog type with auto-generated typeId
   */
  async createWithTypeId(data: Partial<IBlogType>): Promise<IBlogType> {
    try {
      const typeData = {
        ...data,
        typeId: generateUuid(),
      };
      const result = await this.create(typeData);
      return result;
    } catch (error) {
      logger.error('Error creating blog type with typeId:', error);
      throw error;
    }
  }

  /**
   * Update blog type by typeId
   */
  async updateByTypeId(typeId: string, data: Partial<IBlogType>): Promise<IBlogType | null> {
    try {
      const result = await this.model.findOneAndUpdate(
        { typeId },
        { $set: data },
        { new: true }
      );
      return result;
    } catch (error) {
      logger.error(`Error updating blog type by typeId ${typeId}:`, error);
      throw error;
    }
  }

  /**
   * Soft delete blog type by typeId
   */
  async deleteByTypeId(typeId: string): Promise<boolean> {
    try {
      const result = await this.model.findOneAndUpdate(
        { typeId, isDeleted: false },
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
      logger.error(`Error soft deleting blog type by typeId ${typeId}:`, error);
      throw error;
    }
  }
}
