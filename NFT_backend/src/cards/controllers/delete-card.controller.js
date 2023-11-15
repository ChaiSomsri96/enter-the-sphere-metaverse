const db = require("../../../models");

const deleteCard = async (req, res, next) => {
  try {
    const uuid = req.params.id;
    const deleted = await db.Card.destroy({
      where: { uuid },
    });
    res.json(deleted).status(200);
  } catch (error) {}
};

module.exports = deleteCard;
