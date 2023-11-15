const db = require("../../../models");
const marketPrice = require('../helpers/marketprice.helper');

const getCard = async (req, res, next) => {
  try {
    const uuid = req.params.id;

    const cards = await db.Card.findOne({
      where: { uuid },
    });

	const cost = await marketPrice(cards.tokenId);
	if (cost!=null){
		cards.cost = cost;
	}

    res.json(cards).status(200);
  } catch (error) {
    next(error);
  }
};

module.exports = getCard;
