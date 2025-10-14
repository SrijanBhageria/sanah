import * as joi from 'joi';
import { PageType } from '../models/pageTypes';

/**
 * Page item validator
 */
const pageItemValidator = joi.object({
  title: joi.string().trim().max(200).required(),
  description: joi.string().trim().max(1000).required(),
});

/**
 * Number item validator (for landing pages)
 */
const numberItemValidator = joi.object({
  value: joi.string().trim().max(50).required(),
  label: joi.string().trim().max(100).required(),
});

/**
 * Button text validator
 */
const buttonTextValidator = joi.object({
  buttonText: joi.string().trim().max(100).required(),
});

/**
 * Page content creation/update validator
 */
export const createPageContentValidator = joi.object({
  pageType: joi.string().valid(...Object.values(PageType)).required(),
  title: joi.string().trim().max(200).optional(),
  slug: joi.string().trim().lowercase().max(200).optional(),
  content: joi.string().trim().max(5050).optional(),
  subtitle: joi.string().trim().max(500).optional(),
  items: joi.array().items(pageItemValidator).optional().default([]),
  numbers: joi.array().items(numberItemValidator).optional().default([]),
  btnTxt: joi.array().items(buttonTextValidator).optional().default([]),
});

/**
 * Page type query validator
 */
export const pageTypeQueryValidator = joi.object({
  pageType: joi.string().valid(...Object.values(PageType)).required(),
});
