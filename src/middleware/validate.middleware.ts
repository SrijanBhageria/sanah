import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppError } from '../utils/AppError';

/**
 * Generic validation middleware factory
 * @param schema - Joi schema to validate against
 * @param source - Where to get the data from (body, query, params)
 */
export const validate = (
  schema: Joi.ObjectSchema,
  source: 'body' | 'query' | 'params' = 'body',
) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const data = req[source];
    
    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(', ');
      
      throw new AppError(
        `Validation failed: ${errorMessage}`,
        400,
        true,
        'VALIDATION_ERROR',
      );
    }

    // Replace the original data with validated and sanitized data
    if (source === 'query') {
      Object.assign(req.query, value);
    } else {
      req[source] = value;
    }
    next();
  };
};

/**
 * Validate request body
 */
export const validateBody = (schema: Joi.ObjectSchema) =>
  validate(schema, 'body');

/**
 * Validate request query parameters
 */
export const validateQuery = (schema: Joi.ObjectSchema) =>
  validate(schema, 'query');

/**
 * Validate request path parameters
 */
export const validateParams = (schema: Joi.ObjectSchema) =>
  validate(schema, 'params');