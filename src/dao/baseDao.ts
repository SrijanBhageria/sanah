import { Document, Model, FilterQuery, UpdateQuery, QueryOptions } from 'mongoose';
import { logger } from '../logger/logger';
import { MongoCollection } from '../models/mongodb';

/**
 * Base DAO interface for common database operations
 */
export interface IBaseDAO<T extends Document> {
  create(data: Partial<T>): Promise<T>;
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  findOne(filter: FilterQuery<T>): Promise<T | null>;
  findMany(filter: FilterQuery<T>): Promise<T[]>;
  count(filter?: FilterQuery<T>): Promise<number>;
}

/**
 * Base DAO class with common database operations
 */
export abstract class BaseDAO<T extends Document> implements IBaseDAO<T> {
  protected model: Model<T>;
  protected collectionName: MongoCollection;

  constructor(model: Model<T>, collectionName: MongoCollection) {
    this.model = model;
    this.collectionName = collectionName;
  }

  /**
   * Create a new document
   */
  async create(data: Partial<T>): Promise<T> {
    try {
      const document = new this.model(data);
      const savedDocument = await document.save();
      logger.info(`Created ${this.model.modelName} with ID: ${savedDocument._id}`);
      return savedDocument;
    } catch (error) {
      logger.error(`Error creating ${this.model.modelName}:`, error);
      throw error;
    }
  }

  /**
   * Find document by ID
   */
  async findById(id: string): Promise<T | null> {
    try {
      const document = await this.model.findById(id);
      return document;
    } catch (error) {
      logger.error(`Error finding ${this.model.modelName} by ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Find all documents
   */
  async findAll(): Promise<T[]> {
    try {
      const documents = await this.model.find();
      return documents;
    } catch (error) {
      logger.error(`Error finding all ${this.model.modelName}:`, error);
      throw error;
    }
  }

  /**
   * Update document by ID
   */
  async update(id: string, data: Partial<T>): Promise<T | null> {
    try {
      const document = await this.model.findByIdAndUpdate(
        id,
        data as UpdateQuery<T>,
        { new: true, runValidators: true }
      );
      if (document) {
        logger.info(`Updated ${this.model.modelName} with ID: ${id}`);
      }
      return document;
    } catch (error) {
      logger.error(`Error updating ${this.model.modelName} with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete document by ID
   */
  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.model.findByIdAndDelete(id);
      const deleted = !!result;
      if (deleted) {
        logger.info(`Deleted ${this.model.modelName} with ID: ${id}`);
      }
      return deleted;
    } catch (error) {
      logger.error(`Error deleting ${this.model.modelName} with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Find one document by filter
   */
  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    try {
      const document = await this.model.findOne(filter);
      return document;
    } catch (error) {
      logger.error(`Error finding ${this.model.modelName} with filter:`, error);
      throw error;
    }
  }

  /**
   * Find multiple documents by filter
   */
  async findMany(filter: FilterQuery<T>): Promise<T[]> {
    try {
      const documents = await this.model.find(filter);
      return documents;
    } catch (error) {
      logger.error(`Error finding ${this.model.modelName} with filter:`, error);
      throw error;
    }
  }

  /**
   * Count documents by filter
   */
  async count(filter?: FilterQuery<T>): Promise<number> {
    try {
      const count = await this.model.countDocuments(filter || {});
      return count;
    } catch (error) {
      logger.error(`Error counting ${this.model.modelName}:`, error);
      throw error;
    }
  }

  /**
   * Find and update document
   */
  async findOneAndUpdate(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
    options?: QueryOptions
  ): Promise<T | null> {
    try {
      const document = await this.model.findOneAndUpdate(filter, update, {
        new: true,
        runValidators: true,
        ...options,
      });
      return document;
    } catch (error) {
      logger.error(`Error finding and updating ${this.model.modelName}:`, error);
      throw error;
    }
  }
}
