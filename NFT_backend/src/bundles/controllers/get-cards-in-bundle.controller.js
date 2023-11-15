const db = require("../../../models");

const getCardsinBundle = async (req, res, next) => {
  try {
    const uuid = req.params.id;

    const bundle = await db.Bundle.findOne({
      where: { uuid },
    });

    const bundleCards = await db.BundledCard.findAll({
      where: {
        bundleId: bundle.id,
      },
    });
    const cards = [];

    for (let bundled of bundleCards) {
      const bundle = await db.Card.findOne({
        where: {
          id: bundled.cardId,
        },
      });
      cards.push(bundle);
    }

    const update = await db.Bundle.update(
      {
        status: "opened",
      },
      {
        where: { uuid },
      }
    );

    res.json(cards).status(200);
  } catch (error) {
    next(error);
  }
};

module.exports = getCardsinBundle;
