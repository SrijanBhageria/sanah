import joi from 'joi';

/**
 * Blog creation validator
 */
export const createBlogValidator = joi.object({
  title: joi.string().required().trim().max(200),
  slug: joi.string().optional().trim().max(200).lowercase(),
  content: joi.string().required(),
  excerpt: joi.string().required().trim().max(500),
  author: joi.string().required().trim().max(100),
  typeId: joi.string().required(),
  image: joi.string().uri().optional().allow(''),
  tags: joi.array().items(joi.string().trim().max(50)).optional().default([]),
  readTime: joi.number().integer().min(1).max(120).optional(),
  isPublished: joi.boolean().optional().default(false),
});

/**
 * Blog update validator
 */
export const updateBlogValidator = joi.object({
  title: joi.string().optional().trim().max(200),
  slug: joi.string().optional().trim().max(200).lowercase(),
  content: joi.string().optional(),
  excerpt: joi.string().optional().trim().max(500),
  author: joi.string().optional().trim().max(100),
  typeId: joi.string().optional(),
  image: joi.string().uri().optional().allow(''),
  tags: joi.array().items(joi.string().trim().max(50)).optional(),
  readTime: joi.number().integer().min(1).max(120).optional(),
  isPublished: joi.boolean().optional(),
}).min(1);

/**
 * Blog type creation validator
 */
export const createBlogTypeValidator = joi.object({
  name: joi.string().required().trim().max(100),
  slug: joi.string().required().trim().max(100).lowercase(),
  description: joi.string().optional().trim().max(500).allow(''),
  isActive: joi.boolean().optional().default(true),
});

/**
 * Blog type update validator
 */
export const updateBlogTypeValidator = joi.object({
  name: joi.string().optional().trim().max(100),
  slug: joi.string().optional().trim().max(100).lowercase(),
  description: joi.string().optional().trim().max(500).allow(''),
  isActive: joi.boolean().optional(),
}).min(1);

/**
 * Blog query parameters validator
 */
export const blogQueryValidator = joi.object({
  page: joi.number().integer().min(1).optional().default(1),
  limit: joi.number().integer().min(1).max(100).optional().default(10),
  typeId: joi.string().optional(),
  search: joi.string().optional().trim(),
});

/**
 * Blog ID parameter validator
 */
export const blogIdValidator = joi.object({
  blogId: joi.string().required(),
});

/**
 * Blog type ID parameter validator
 */
export const blogTypeIdValidator = joi.object({
  typeId: joi.string().required(),
});