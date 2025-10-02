import { Router } from 'express';
import {
  getTypesWithBlogs,
  getBlogsByType,
  getBlogByBlogId,
  getBlogTypes,
  createBlog,
  updateBlog,
  deleteBlog,
  createBlogType,
  updateBlogType,
  deleteBlogType,
} from '../controllers/blog.controller';
import {
  blogQueryValidator,
  blogIdValidator,
  createBlogValidator,
  updateBlogValidator,
  createBlogTypeValidator,
  updateBlogTypeValidator,
  blogTypeIdValidator,
} from '../validators/blog.validator';
import { validateBody, validateQuery } from '../middleware/validate.middleware';
import { generalLimiter, blogWriteLimiter, blogTypeWriteLimiter } from '../middleware/rateLimiter.middleware';
import { securityAuditLogger } from '../middleware/audit.middleware';

const router = Router();

// Apply general rate limiting to all routes
router.use(generalLimiter);

// GET APIs
router.get('/getTypesWithBlogs', validateQuery(blogQueryValidator), getTypesWithBlogs);
router.get('/getBlogsByType', validateQuery(blogQueryValidator), getBlogsByType);
router.get('/getBlogByBlogId', validateQuery(blogIdValidator), getBlogByBlogId);
router.get('/getBlogTypes', getBlogTypes);

// POST APIs (for create, update, soft delete operations) - with security audit logging
router.post('/createBlog', blogWriteLimiter, validateBody(createBlogValidator), securityAuditLogger, createBlog);
router.post('/updateBlog', blogWriteLimiter, validateQuery(blogIdValidator), validateBody(updateBlogValidator), securityAuditLogger, updateBlog);
router.post('/deleteBlog', blogWriteLimiter, validateQuery(blogIdValidator), securityAuditLogger, deleteBlog);
router.post('/createBlogType', blogTypeWriteLimiter, validateBody(createBlogTypeValidator), securityAuditLogger, createBlogType);
router.post('/updateBlogType', blogTypeWriteLimiter, validateQuery(blogTypeIdValidator), validateBody(updateBlogTypeValidator), securityAuditLogger, updateBlogType);
router.post('/deleteBlogType', blogTypeWriteLimiter, validateQuery(blogTypeIdValidator), securityAuditLogger, deleteBlogType);

export default router;