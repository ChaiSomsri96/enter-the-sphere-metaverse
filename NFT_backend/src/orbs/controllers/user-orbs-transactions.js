const db = require("../../../models");

const userOrbsTransactions = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const amount = req.body.amount;

    const user = await db.User.findOne({
      where: {
        uuid: userId,
      },
    });

    const transactions = await db.balanceTransactions.findAll({
      where: {
        id: user.id,
      },
    });
    res.json(transactions).status(200);
  } catch (error) {
    next(error);
  }
};

module.exports = userOrbsTransactions;
