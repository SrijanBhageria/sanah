import joi from 'joi';

export const createLandingPageValidator = joi.object({
    header: joi.string().optional(),
    subtitle: joi.string().optional(),
    numbers: joi.array().items(joi.object({
        value: joi.string().required(),
        label: joi.string().required()
    })).optional()
}).min(1) // At least one field must be provided