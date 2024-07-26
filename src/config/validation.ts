import * as Joi from 'joi';

export const configSchemaValidation = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production').required(),
  PORT: Joi.number().port().required(),
  DATABASE_URL: Joi.string().required(),
  SECRET_TOKEN: Joi.string().required(),
  REDIS_HOST: Joi.string().required(),
  REDIS_USER: Joi.string().required(),
  REDIS_PASSWORD: Joi.string().required(),
  REDIS_PORT: Joi.number().port().required(),
});
