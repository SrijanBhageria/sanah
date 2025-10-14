import joi from 'joi';

/**
 * Section validator for investment card sections
 */
const sectionValidator = joi.object({
  sectionId: joi.string().trim().optional(), // UUID will be generated if not provided
  title: joi.string().trim().max(200).optional(),
  content: joi.alternatives().try(
    joi.string().trim().max(2000), // String content
    joi.array().items(joi.string().trim().max(500)), // Array of strings
    joi.array().items(joi.object({ // Array of objects like {item: "text"}
      item: joi.string().trim().max(500).optional()
    })),
    joi.object() // Generic object content
  ).optional(),
  order: joi.number().integer().min(1).optional(),
});

/**
 * Investment card creation/update validator - supports partial updates and soft delete
 */
export const createOrUpdateInvestmentCardSchema = joi.object({
  cardId: joi.string().trim().optional(),
  companyName: joi.string().trim().max(200).optional(),
  companyLogo: joi.string().trim().max(500).optional(),
  sections: joi.array().items(sectionValidator).optional().default([]),
  isDeleted: joi.boolean().optional(), // For soft delete operations
});

/**
 * Card ID query parameter validator
 */
export const cardIdValidator = joi.object({
  id: joi.string().required(),
});
