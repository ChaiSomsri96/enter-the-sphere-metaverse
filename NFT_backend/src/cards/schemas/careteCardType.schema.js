const Joi = require("joi");

const createCardTypeSchema = Joi.object({
  name: Joi.string().required(),
});

module.exports = createCardTypeSchema;
