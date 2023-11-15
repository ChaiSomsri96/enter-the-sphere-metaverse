const db = require("../../../models");

const updateCard = async (req, res, next) => {
  try {
    console.log("hit");
    const uuid = req.params.id;
    const body = req.body;
    console.log("uudid", uuid);
    const update = await db.Card.update(body, {
      where: {
        uuid,
      },
    });

    res.json(update).status(200);
  } catch (error) {
    next(error);
  }
};

module.exports = updateCard;
