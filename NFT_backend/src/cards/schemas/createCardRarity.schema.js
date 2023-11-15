const Joi = require("joi");

const createCardRaritySchema = Joi.object({
  name: Joi.string().required(),
  totalSupply: Joi.number().required(),
});

module.exports = createCardRaritySchema;
