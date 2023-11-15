const db = require("../../../models");

const getUserBundles = async (req, res, next) => {
  try {
    const uuid = req.params.id;
    console.log(uuid);
    const user = await db.User.findOne({
      where: { uuid },
    });

    const opened = req.query.opened;
    console.log(req.query);
    let bundles;
		let status = null;
    if (opened === "true") {
			status = "opened"
		}

    bundles = await db.Bundle.findAll({
      where: {
        userId: user.id,
        status: status,
      },
			order: [['createdAt', 'DESC'],],
    });

    res.json(bundles).status(200);
  } catch (error) {
    next(error);
  }
};

module.exports = getUserBundles;
