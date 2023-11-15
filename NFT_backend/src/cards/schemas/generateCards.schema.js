const Joi = require("joi");

const generateCardsSchema = Joi.object({
  slpAddress: Joi.string().required(),
  privateKey: Joi.string().required(),
});

module.exports = generateCardsSchema;
