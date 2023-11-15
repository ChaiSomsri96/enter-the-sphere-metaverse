const db = require("../../../models");

const getBundles = async (req, res, next) => {
  try {
    const bundles = await db.Bundle.findAll();

    res.json(bundles).status(200);
  } catch (error) {
    next(error);
  }
};

module.exports = getBundles;
