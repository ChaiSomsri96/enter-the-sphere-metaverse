const db = require("../../../models");

const getUsers = async (req, res, next) => {
  try {
    const users = await db.User.findAll();

    res.json(users).status(200);
  } catch (error) {
    next(error);
  }
};

module.exports = getUsers;
