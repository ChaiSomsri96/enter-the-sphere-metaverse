const db = require("../../../../models");

const getPurchases = async (req, res, next) => {
  /* #swagger.security = [{
       "apiKeyAuth": []
  }] */
  try {
    const purchases = await db.Purchase.findAll({
      include: "User",
    });

    res.json(purchases).status(200);
  } catch (error) {
    next(error);
  }
};

module.exports = getPurchases;
