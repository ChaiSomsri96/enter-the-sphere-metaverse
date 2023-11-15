const db = require("../../../models");

const deleteUser = async (req, res, next) => {
  try {
    const uuid = req.params.id;
  } catch (error) {
    next(error);
  }
};

module.exports = deleteUser;
