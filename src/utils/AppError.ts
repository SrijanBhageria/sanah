/**
 * Custom Error class for application-specific errors
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code: string | undefined;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    code?: string,
  ) {
    super(message);
    
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.code = code;

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Factory function to create common error types
 */
export const createError = {
  badRequest: (message: string, code?: string) =>
    new AppError(message, 400, true, code),
  
  unauthorized: (message: string = 'Unauthorized', code?: string) =>
    new AppError(message, 401, true, code),
  
  forbidden: (message: string = 'Forbidden', code?: string) =>
    new AppError(message, 403, true, code),
  
  notFound: (message: string = 'Resource not found', code?: string) =>
    new AppError(message, 404, true, code),
  
  conflict: (message: string, code?: string) =>
    new AppError(message, 409, true, code),
  
  validation: (message: string, code?: string) =>
    new AppError(message, 422, true, code),
  
  internal: (message: string = 'Internal server error', code?: string) =>
    new AppError(message, 500, true, code),
};
