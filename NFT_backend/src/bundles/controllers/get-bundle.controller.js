const db = require("../../../models");

const getBundle = async (req, res, next) => {
  try {
    const uuid = req.params.id;

    const bundles = await db.Bundle.findOne({
      where: {
        uuid,
      },
    });

    res.json(bundles).status(200);
  } catch (error) {
    next(error);
  }
};

module.exports = getBundle;
