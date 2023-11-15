const db = require("../../../../models");

const getUserSafeWallet = async (req, res, next) => {
  try {
    const uuid = req.params.id;
    const user = await db.User.findOne({
      where: { uuid },
    });

    const walet = await db.SafeWallet.findOne({
      where: { userId: user.id },
    });
    res.json(walet).status(200);
  } catch (error) {
    next(error);
  }
};

module.exports = getUserSafeWallet;
