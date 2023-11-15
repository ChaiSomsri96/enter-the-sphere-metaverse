const db = require("../../../models");

const updateUser = async (req, res, next) => {
  try {
    const body = req.body;
    const uuid = req.params.id;
    const update = await db.User.update(body, {
      where: {
        uuid,
      },
    });
    console.log("update", update);
    res.json({ message: "updated successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = updateUser;
