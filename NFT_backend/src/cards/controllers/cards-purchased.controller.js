const db = require("../../../models");

const cardPurchasedController = async (req, res, next) => {
  try {
    const uuid = req.body.userId;
    const user = await db.User.findOne({
      where: { uuid },
    });

    const cards = [];
    bundledCards = await db.BundledCard.findAll({
      where: { userId: user.id },
    });
    console.log("user", bundledCards);

    for (let card of bundledCards) {
      const newCard = await db.Card.findOne({
        where: {
          id: card.cardId,
        },
      });
      cards.push(newCard);
    }

    res.json(cards).status(200);
  } catch (error) {
    next(error);
  }
};

module.exports = cardPurchasedController;
