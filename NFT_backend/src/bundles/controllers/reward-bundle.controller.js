const generateBundleForUser = require("../helpers/generateBundle.helper");
const db = require('../../../models');
const redis = require('../../redis');

const rewardBundle = async (req, res, next) => {

	try {
		const reward = req.body.reward;
		const amount = req.body.amount;
		const userUuid = req.body.userid;

		var result = {};

		if (reward == 'card_pack') {

			const user = await db.User.findOne({ where: { uuid: userUuid } });
			result.user = user;

			const cardsperpack = 5;

			result.bundles = [];

			for (let i = 0; i < amount; i++) {
				const purchase = await db.Purchase.create({ userId: user.id });
				const resp = await generateBundleForUser(user.id, purchase.id, cardsperpack);

				redis.publish(`sendto:${userUuid}:reward`, JSON.stringify(resp))

				result.bundles.push(resp);

			}
		} else {
			result.error = "Unknown reward type: " + reward;
		}

		res.json(result).status(200);
	} catch (err) {
		console.error(err);
		next(err);
	}
}

module.exports = rewardBundle;
