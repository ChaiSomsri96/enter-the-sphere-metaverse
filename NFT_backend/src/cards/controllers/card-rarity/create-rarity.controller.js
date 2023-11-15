const db = require("../../../../models");
const createCardRaritySchema = require("../../schemas/createCardRarity.schema");

const createRarity = async (req, res, next) => {
  try {
    const body = await createCardRaritySchema.validateAsync(req.body);

    const { name, totalSupply } = body;

    const addType = await db.Rarity.create({
      name,
      totalSupply,
    });

    res.json(addType).status(201);
  } catch (error) {
    next(error);
  }
};

module.exports = createRarity;
