const db = require("../../../models");

const marketListingByCard = async (req, res, next) => {
  try {
    const cardId = req.body.cardId;
    const card = await db.Card.findOne({
      where: {
        uuid: cardId,
      },
    });
    const marketListings = await db.marketListings.findAll({
      where: {
        cardId: card.id,
      },
    });

    res.json(marketListings).status(200);
  } catch (error) {
    next(error);
  }
};

module.exports = marketListingByCard;
