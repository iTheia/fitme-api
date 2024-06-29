import * as Joi from 'joi';

export const configSchemaValidation = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production').required(),
  PORT: Joi.number().port().required(),
  DATABASE_URL: Joi.string().required(),
  SALT: Joi.number().required(),
  SECRET_TOKEN: Joi.string().required(),
});
