const Coinpayments = require("coinpayments");
const createBundlePurchase = require("../../bundles/helpers/createBundlepurcahse.helper");
const generateBundleforUser = require("../../bundles/helpers/generateBundle.helper");
const db = require("../../../models");
const redis = require("../../redis");

// /api/v1/payment/crypto/ipn
const coinpaymentsIPN = async(req,res,next)=>{
	try {
		console.log("Received IPN");
		console.log(req.body);
		// todo: implement HMAC verification
		// https://www.coinpayments.net/merchant-tools-ipn
		// IMPORTANT: You should never ship/release your product until the status is >= 100 OR == 2 (Queued for nightly payout)!
		const srcTxnId = req.body.txn_id;
//		const payload = req.body.custom;
		const status = req.body.status;


		if (status>=100 || status==2){

			console.log("status is ok");

			const payload = JSON.parse(await redis.get(`CP:TXMeta:${srcTxnId}`));

			const uuid = payload.uuid;
			const qty = payload.qty;
			const amount = payload.amount; // expected in USD

			const user = await db.User.findOne({where: {uuid: uuid}});

			if (user==null){
				throw 'User not found';
			}

			const purchaseObj = {
				status: status,
				quantity: qty,
				paymentMethod: "coinpayments",
				price: amount,
				userId: user.id,
			};

			const purchase = await createBundlePurchase(purchaseObj);
			for (let i=0;i<qty;i++){
				await generateBundleforUser(user.id, purchase.id, 5);
			}
		}

		res.json({}).status(200);
	}catch(error){
		console.error(error);
		next(error);
	}
}

module.exports = coinpaymentsIPN;
