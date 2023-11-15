const db = require("../../../models");

const getUserTransactions = async (req, res, next) => {
  try {
    const uuid = req.params.id;
    const user = await db.User.findOne({
      where: { uuid },
    });
    const transactions = await db.Transaction.findAll({
      where: {
        userId: user.id,
      },
    });

    res.json(transactions).status(200);
  } catch (error) {
    next(error);
  }
};

module.exports = getUserTransactions;
