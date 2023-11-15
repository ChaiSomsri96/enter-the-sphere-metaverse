const db = require("../../../../models");
const generateWallet = require("../../helpers/generateWallet.helper");

const createSafeWallet = async (req, res, next) => {
  try {
    const uuid = req.body.userId;
    const user = await db.User.findOne({
      where: {
        uuid,
      },
    });

    const checkWallet = await db.SafeWallet.findOne({
      userId: user.id,
    });

    if (checkWallet) {
      next(new Error("Wallet already exist"));
    }

    const walletd = await generateWallet(user.id);

    res.json(walletd).status(201);
  } catch (error) {
    next(error);
  }
};

module.exports = createSafeWallet;
