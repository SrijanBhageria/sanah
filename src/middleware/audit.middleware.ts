import { Request, Response, NextFunction } from 'express';
import { logger } from '../logger/logger';

/**
 * Audit logging middleware for API requests and responses
 */
export const auditLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();
  const originalSend = res.send;

  // Override res.send to capture response data
  res.send = function(body: any): Response {
    const endTime = Date.now();
    const duration = endTime - startTime;

    // Log the request and response
    const auditLog = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      originalUrl: req.originalUrl,
      ip: req.ip,
      userAgent: req.get('User-Agent') || 'Unknown',
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      contentLength: res.get('Content-Length') || '0',
      requestBody: req.method === 'POST' || req.method === 'PUT' ? req.body : undefined,
      queryParams: Object.keys(req.query).length > 0 ? req.query : undefined,
      requestHeaders: {
        'content-type': req.get('Content-Type'),
        'content-length': req.get('Content-Length'),
        'accept': req.get('Accept'),
      },
    };

        // Delay logging to ensure HTTP log appears first
        setImmediate(() => {
          // Log based on status code
          if (res.statusCode >= 400) {
            logger.error('API Request Failed:', auditLog);
          } else {
            logger.info('API Request:', auditLog);
          }
        });

    // Call original send method
    return originalSend.call(this, body);
  };

  next();
};

/**
 * Security audit middleware for sensitive operations
 * This middleware should be placed AFTER body parsing and validation
 */
export const securityAuditLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();
  const originalSend = res.send;

  // Store request data immediately when middleware runs
  const requestData = {
    body: req.body || {},
    query: req.query || {},
    params: req.params || {},
  };

  res.send = function(body: any): Response {
    const endTime = Date.now();
    const duration = endTime - startTime;

    // Log security-sensitive operations with detailed request data
    const securityLog = {
      timestamp: new Date().toISOString(),
      operation: req.method,
      endpoint: req.url,
      ip: req.ip,
      userAgent: req.get('User-Agent') || 'Unknown',
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      requestData: requestData,
      responseSize: res.get('Content-Length') || '0',
    };

        // Delay logging to ensure HTTP log appears first
        setImmediate(() => {
          // Log all security-sensitive operations
          logger.warn('Security Audit:', securityLog);
        });

    return originalSend.call(this, body);
  };

  next();
};
