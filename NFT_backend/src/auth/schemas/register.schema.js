const Joi = require("joi");

const registerSchema = Joi.object({
  email: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  telegramId: [Joi.string().optional(), Joi.allow(null)],
  password: Joi.string().required(),
  active: Joi.boolean(),
});

module.exports = registerSchema;
