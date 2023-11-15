const db = require("../../../../models");

const getUserPurcahes = async (req, res, next) => {
  try {
    const uuid = req.params.uuid;

    const purchases = await db.Purchase.findAll({
      where: {
        userId: uuid,
      },
    });

    res.json(purchases).status(200);
  } catch (error) {
    next(error);
  }
};

module.exports = getUserPurcahes;
