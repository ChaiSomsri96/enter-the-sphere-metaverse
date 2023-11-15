const db = require("../../../../models");

const getSafeWallet = async (req, res, next) => {
  try {
    const uuid = req.params.id;

    const user = await db.User.findOne({
      where: {
        uuid,
      },
    });
    const wallet = await db.SafeWallet.findOne({
      where: {
        userId: user.id,
      },
    });

    res.json(wallet);
  } catch (error) {
    next(error);
  }
};

module.exports = getSafeWallet;
