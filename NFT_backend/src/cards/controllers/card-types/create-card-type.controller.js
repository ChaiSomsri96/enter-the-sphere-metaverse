const db = require("../../../../models");
const createCardTypeSchema = require("../../schemas/careteCardType.schema");

const createCardType = async (req, res, next) => {
  try {
    const body = await createCardTypeSchema.validateAsync(req.body);

    const { name } = body;

    const addType = await db.CardType.create({
      name,
    });

    res.json(addType).status(201);
  } catch (error) {
    next(error);
  }
};

module.exports = createCardType;
