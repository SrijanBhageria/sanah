import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';
import { env } from '../config/env';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role?: string;
      };
    }
  }
}

/**
 * Authentication middleware to verify JWT tokens
 */
export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(
        'Access token is required',
        401,
        true,
        'UNAUTHORIZED',
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      throw new AppError(
        'Access token is required',
        401,
        true,
        'UNAUTHORIZED',
      );
    }

    // Verify the token
    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string; email: string; role?: string };
    
    // Add user info to request object
    req.user = {
      id: decoded.id,
      email: decoded.email,
      ...(decoded.role && { role: decoded.role }),
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Invalid token', 401, true, 'INVALID_TOKEN'));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new AppError('Token expired', 401, true, 'TOKEN_EXPIRED'));
    } else {
      next(error);
    }
  }
};

/**
 * Authorization middleware to check user roles
 * @param roles - Array of allowed roles
 */
export const authorize = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError(
        'Authentication required',
        401,
        true,
        'UNAUTHORIZED',
      );
    }

    if (roles.length > 0 && !roles.includes(req.user.role || '')) {
      throw new AppError(
        'Insufficient permissions',
        403,
        true,
        'FORBIDDEN',
      );
    }

    next();
  };
};

/**
 * Optional authentication middleware (doesn't throw error if no token)
 */
export const optionalAuth = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      if (token) {
        const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string; email: string; role?: string };
        req.user = {
          id: decoded.id,
          email: decoded.email,
          ...(decoded.role && { role: decoded.role }),
        };
      }
    }
    
    next();
  } catch {
    // Ignore authentication errors for optional auth
    next();
  }
};
