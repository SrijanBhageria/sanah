import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';
import { env } from '../config/env';

/**
 * Global error handling middleware
 */
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  let statusCode = 500;
  let message = 'Internal server error';
  let code: string | undefined;

  // Handle AppError instances
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    code = error.code;
  } else if (error.name === 'ValidationError') {
    // Handle Mongoose validation errors
    statusCode = 400;
    message = 'Validation failed';
    code = 'VALIDATION_ERROR';
  } else if (error.name === 'CastError') {
    // Handle Mongoose cast errors
    statusCode = 400;
    message = 'Invalid ID format';
    code = 'INVALID_INPUT';
  } else if (error.name === 'MongoError' && (error as unknown as { code: number }).code === 11000) {
    // Handle MongoDB duplicate key errors
    statusCode = 409;
    message = 'Resource already exists';
    code = 'RESOURCE_ALREADY_EXISTS';
  } else if (error.name === 'JsonWebTokenError') {
    // Handle JWT errors
    statusCode = 401;
    message = 'Invalid token';
    code = 'INVALID_TOKEN';
  } else if (error.name === 'TokenExpiredError') {
    // Handle JWT expiration errors
    statusCode = 401;
    message = 'Token expired';
    code = 'TOKEN_EXPIRED';
  }

  // Log error
  logger.error(`Error occurred: ${error.message} | ${req.method} ${req.url} | IP: ${req.ip}`);

  // Send error response
  const errorResponse: { success: boolean; message: string; code?: string; stack?: string } = {
    success: false,
    message,
    ...(code && { code }),
  };

  // Include stack trace in development
  if (env.NODE_ENV === 'development' && error.stack) {
    errorResponse.stack = error.stack;
  }

  res.status(statusCode).json(errorResponse);
};

/**
 * Handle 404 errors
 */
export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const error = new AppError(
    `Route ${req.originalUrl} not found`,
    404,
    true,
    'RESOURCE_NOT_FOUND',
  );
  next(error);
};
