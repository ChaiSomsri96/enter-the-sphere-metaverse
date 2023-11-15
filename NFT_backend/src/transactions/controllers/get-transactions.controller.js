const db = require("../../../models");

const getTransactions = async (req, res, next) => {
  try {
    const transactions = await db.Transaction.findAll();
    res.json(transactions).json(200);
  } catch (error) {
    next(error);
  }
};

module.exports = getTransactions;
