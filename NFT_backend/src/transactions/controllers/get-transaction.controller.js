const getTransaction = async (req, res, next) => {
  try {
    const uuid = req.params.id;

    const transactions = await db.Transaction.findOne({
      where: { uuid },
    });
    res.json(transactions).json(200);
  } catch (error) {
    next(error);
  }
};

module.exports = getTransaction;
