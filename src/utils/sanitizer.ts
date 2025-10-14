/**
 * Sanitize HTML content to prevent XSS attacks
 * @param dirty - The potentially unsafe HTML string
 * @returns Sanitized HTML string
 */
export const sanitizeHtml = (dirty: string): string => {
  if (!dirty || typeof dirty !== 'string') {
    return '';
  }
  
  // Simple HTML sanitization - remove script tags and dangerous attributes
  return dirty
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/<link\b[^<]*(?:(?!<\/link>)<[^<]*)*<\/link>/gi, '')
    .replace(/<meta\b[^<]*(?:(?!<\/meta>)<[^<]*)*<\/meta>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/data:/gi, '');
};

/**
 * Sanitize plain text content
 * @param text - The potentially unsafe text string
 * @returns Sanitized text string
 */
export const sanitizeText = (text: string): string => {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  // Remove HTML tags and decode HTML entities
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&#x60;/g, '`')
    .replace(/&#x3D;/g, '=')
    .trim();
};

/**
 * Sanitize blog data
 * @param data - Blog data object
 * @returns Sanitized blog data
 */
export const sanitizeBlogData = (data: any): any => {
  if (!data || typeof data !== 'object') {
    return data;
  }

  const sanitized = { ...data };

  // Sanitize text fields
  if (sanitized.title) {
    sanitized.title = sanitizeText(sanitized.title);
  }
  if (sanitized.slug) {
    sanitized.slug = sanitizeText(sanitized.slug).toLowerCase().replace(/[^a-z0-9-]/g, '-');
  }
  if (sanitized.excerpt) {
    sanitized.excerpt = sanitizeText(sanitized.excerpt);
  }
  if (sanitized.author) {
    sanitized.author = sanitizeText(sanitized.author);
  }
  if (sanitized.content) {
    sanitized.content = sanitizeHtml(sanitized.content);
  }
  if (sanitized.tags && Array.isArray(sanitized.tags)) {
    sanitized.tags = sanitized.tags.map((tag: string) => sanitizeText(tag)).filter((tag: string) => tag.length > 0);
  }

  return sanitized;
};

/**
 * Sanitize blog type data
 * @param data - Blog type data object
 * @returns Sanitized blog type data
 */
export const sanitizeBlogTypeData = (data: any): any => {
  if (!data || typeof data !== 'object') {
    return data;
  }

  const sanitized = { ...data };

  // Sanitize text fields
  if (sanitized.name) {
    sanitized.name = sanitizeText(sanitized.name);
  }
  if (sanitized.slug) {
    sanitized.slug = sanitizeText(sanitized.slug).toLowerCase().replace(/[^a-z0-9-]/g, '-');
  }
  if (sanitized.description) {
    sanitized.description = sanitizeText(sanitized.description);
  }

  return sanitized;
};

