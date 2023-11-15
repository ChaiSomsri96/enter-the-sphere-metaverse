const db = require("../../../models");

const addMarketListing = async (req, res, next) => {
  const userId = req.body.userId;
  const cardId = req.body.cardId;

  const user = await db.User.findOne({
    where: {
      uuid: userId,
    },
  });

  const card = await db.Card.findOne({
    where: {
      uuid: cardId,
    },
  });

  const add = await db.marketlistings.create({
    userId: user.id,
    cardId: card.Id,
    status: "added",
    price: req.body.price,
  });

  res.json({
    data: "Market listing added successfully",
  });
};

module.exports = addMarketListing;
