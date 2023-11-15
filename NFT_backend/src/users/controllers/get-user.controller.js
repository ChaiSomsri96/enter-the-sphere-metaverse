const db = require("../../../models");

const getUser = async (req, res, next) => {
  try {
    const uuid = req.params.id;
    const user = await db.User.findOne({
      where: {
        uuid,
      },
    });
    res.json(user).status(200);
  } catch (error) {
    next(error);
  }
};

module.exports = getUser;
