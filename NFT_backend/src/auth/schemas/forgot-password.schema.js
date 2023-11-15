const Joi = require("joi");

const forgotPasswordSchema = Joi.object({
  email: Joi.string().required(),
});

module.exports = forgotPasswordSchema;
