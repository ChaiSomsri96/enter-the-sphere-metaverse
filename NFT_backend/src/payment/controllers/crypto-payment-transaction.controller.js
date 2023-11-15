const Coinpayments = require("coinpayments");
const config = require("../../config");
const db = require("../../../models");
const redis = require("../../redis");

let client = null;
if (typeof config.coinpaymentsPublic == 'string' && config.coinpaymentsPublic.length>0 ) {
	 client = new Coinpayments({
		key: config.coinpaymentsPublic,//"cad7efc5560063816c0928016e4284bc4d46db4d83112fd2f2c1a7b43e026ab8",
	  secret: config.coinpaymentsPrivate,//"3FdA48f757e5c67802cB6177651ef2bf63Dfa36B94E8B65F0269efa73858EcFd",
	});
}

const YOUR_DOMAIN = config.frontUrl;

const cryptoPaymentTransactionController = async (req, res, next) => {
  try {

		console.log("body");
		console.log(req.body);

    const uuid = req.body.userId;

    const user = db.User.findOne({
      where: { uuid },
    });

		if (user==null){
			throw 'User does not exist';
		}

		let qty = req.body.quantity;
		if (typeof qty!=='number'){
			qty=1;
		}

		if (qty < 1 ){
			qty=1;
		}

    const custom = {uuid: uuid, qty: qty, amount: 2*qty};

    const obj = {
      currency1: "USD",
      currency2: "BCH",
      amount: 2*qty,// fixme: move me to env vars
      buyer_email: user.email ? user.email : "noreply@enter-the-sphere.com",
      item_name: "MASTER FORGE",
      item_number: qty,

			custom: custom,
			
      ipn_url: `${YOUR_DOMAIN}/api/v1/payments/crypto/ipn`,
      success_url: `${YOUR_DOMAIN}/lootbox/success`,
      cancel_url: `${YOUR_DOMAIN}`,
    };


		console.log("user");
		console.log(user);

		console.log("request to coinpayments");
		console.log(obj);

    const txCreate = await client.createTransaction(obj);

    redis.set(`CP:TXMeta:${txCreate.txn_id}`,JSON.stringify(custom));

		console.log("response");
    console.log(txCreate);

		res.json(txCreate).status(200);
  } catch (error) {
		console.error(error);
    next(error);
  }
};

module.exports = cryptoPaymentTransactionController;
