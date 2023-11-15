const Joi = require("joi");

const verifySchema = Joi.object({
  token: Joi.string().required(),
});

module.exports = verifySchema;
