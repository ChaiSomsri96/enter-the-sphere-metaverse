const db = require("../../../models");

const createCard = async (req, res, next) => {
  try {
    const body = req.body;

    const createCards = await db.Card.create(body);

    res.json(createCards);
  } catch (error) {
    next(error);
  }
};

module.exports = createCard;
