const createTradingWallet = async (req, res, next) => {
  const uuid = req.body.userId;
  const user = await db.findOne({
    where: {
      uuid,
    },
  });

  const generateWallet = await generateWallet(user.id);

  res.json(generateWallet);
};

module.exports = createTradingWallet;
