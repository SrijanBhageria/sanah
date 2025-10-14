import * as joi from 'joi';

/**
 * Footer link validator
 */
const footerLinkValidator = joi.object({
  text: joi.string().trim().max(100).optional(),
  url: joi.string().trim().max(500).optional(),
});

/**
 * Footer contact validator - supports partial updates
 */
const footerContactValidator = joi.object({
  email: joi.string().email().trim().lowercase().max(100).optional(),
  phone: joi.string().trim().max(50).optional(),
  address: joi.string().trim().max(500).optional(),
});

/**
 * Footer section validator
 */
const footerSectionValidator = joi.object({
  title: joi.string().trim().max(100).optional(),
  links: joi.array().items(footerLinkValidator).optional().default([]),
});

/**
 * Social media link validator
 */
const socialMediaLinkValidator = joi.object({
  platform: joi.string().trim().max(50).optional(),
  url: joi.string().trim().max(500).optional(),
  icon: joi.string().trim().max(100).optional(),
});

/**
 * Footer creation/update validator
 */
export const createOrUpdateFooterSchema = joi.object({
  companyName: joi.string().trim().max(200).optional(),
  companyDescription: joi.string().trim().max(1000).optional(),
  contact: footerContactValidator.optional(),
  sections: joi.array().items(footerSectionValidator).optional().default([]),
  socialMedia: joi.array().items(socialMediaLinkValidator).optional().default([]),
  backToTopText: joi.string().trim().max(100).optional(),
  copyrightText: joi.string().trim().max(500).optional(),
  legalLinks: joi.array().items(footerLinkValidator).optional().default([]),
});
