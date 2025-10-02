import rateLimit from 'express-rate-limit';
import { logger } from '../logger/logger';

/**
 * General API rate limiter: 1000 requests per 15 minutes
 * Adjusted for 100,000 users/day (4,167 requests/hour)
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs (was 100)
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    code: 'RATE_LIMIT_EXCEEDED',
    data: null,
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip} on ${req.method} ${req.url}`);
    res.status(429).json({
      success: false,
      message: 'Too many requests from this IP, please try again later.',
      code: 'RATE_LIMIT_EXCEEDED',
      data: null,
    });
  },
});

/**
 * Blog write operations rate limiter: 50 requests per 15 minutes
 * Adjusted for high-volume blog creation/updates
 */
export const blogWriteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 requests per windowMs for blog write operations (was 10)
  message: {
    success: false,
    message: 'Too many blog write operations from this IP, please try again later.',
    code: 'BLOG_WRITE_RATE_LIMIT_EXCEEDED',
    data: null,
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Blog write rate limit exceeded for IP: ${req.ip} on ${req.method} ${req.url}`);
    res.status(429).json({
      success: false,
      message: 'Too many blog write operations from this IP, please try again later.',
      code: 'BLOG_WRITE_RATE_LIMIT_EXCEEDED',
      data: null,
    });
  },
});

/**
 * Blog type write operations rate limiter: 20 requests per 15 minutes
 * Adjusted for blog type management operations
 */
export const blogTypeWriteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs for blog type write operations (was 5)
  message: {
    success: false,
    message: 'Too many blog type operations from this IP, please try again later.',
    code: 'BLOG_TYPE_RATE_LIMIT_EXCEEDED',
    data: null,
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Blog type write rate limit exceeded for IP: ${req.ip} on ${req.method} ${req.url}`);
    res.status(429).json({
      success: false,
      message: 'Too many blog type write operations from this IP, please try again later.',
      code: 'BLOG_TYPE_WRITE_RATE_LIMIT_EXCEEDED',
      data: null,
    });
  },
});

/**
 * Landing page operations rate limiter: 100 requests per 15 minutes
 * For landing page updates (less frequent but important)
 */
export const landingPageLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs for landing page operations
  message: {
    success: false,
    message: 'Too many landing page operations from this IP, please try again later.',
    code: 'LANDING_PAGE_RATE_LIMIT_EXCEEDED',
    data: null,
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Landing page rate limit exceeded for IP: ${req.ip} on ${req.method} ${req.url}`);
    res.status(429).json({
      success: false,
      message: 'Too many landing page operations from this IP, please try again later.',
      code: 'LANDING_PAGE_RATE_LIMIT_EXCEEDED',
      data: null,
    });
  },
});

