const db = require("../../../../models");

const getPurchase = async (req, res, next) => {
  // #swagger.tags = ['Bundle']
  // #swagger.description = ['Endpoint to get purchase']
  try {
    console.log("params", req.params);
    const purchase = await db.Purchase.findOne({
      where: { uuid: req.params.uuid },
    });

    res.json(purchase).status(200);
  } catch (error) {
    next(error);
  }
};

module.exports = getPurchase;
