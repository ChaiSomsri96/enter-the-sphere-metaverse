const buyOrbs = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const amount = req.body.amount;

    const user = await db.User.findOne({
      where: {
        uuid: userId,
      },
    });

    const blanace = user.
    const update = db.User.update({
        
    })

  } catch (error) {
    next(error);
  }
};
