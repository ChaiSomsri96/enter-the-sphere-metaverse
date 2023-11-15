const generateBundleForUser = require("../helpers/generateBundle.helper");
const db = require('../../../models');

const createBundle = async (req, res, next) => {
	// body params: userId, numBundles, quantity
	//
  // #swagger.tags = ['Bundles']
  // #swagger.description = ['Endpoint to create bundle from admin side']
  /* #swagger.parameters['body'] = {
    in: "body",
    required: true,
    schema: { $ref: "#/definitions/CreateBundle" }
  } */

	try {
		console.log(`create bundle called ${JSON.stringify(req.body)}`);
		const userId = req.body.userId;

		// Verify user is exist
		if (typeof userId!=='string'){
			throw new Error("bad argument");
		}

		console.log('looking for user');
		const user = await db.User.findOne({where: {uuid: userId}});

		if (user==null){
			throw new Error("bad argument");
		}
		// -Verify user is exist

		let bundlesToOpen = req.body.numBundles;
		if (typeof bundlesToOpen!=='number'){
			bundlesToOpen=1;
		}

		if (bundlesToOpen<1) {
			bundlesToOpen=1;
		}

		if (bundlesToOpen > 100){
			bundlesToOpen=100;
		}

		for (let i=0;i<bundlesToOpen;i++){
			// Each bundle should have a valid link to purchase. 
			// In this case it is empty purchase
			const purchase = await db.Purchase.create({userId: user.id});

			console.log(`generating bundle for user ${user.id} qty: ${req.body.quantity}`);

			const resp = await generateBundleForUser(user.id,
				purchase.id,
				req.body.quantity)

			console.log(`generated: ${resp}`);
		}

		res.json({}).status(201);
	}catch(error){
		console.log(error);
		next(error);
	}
};

module.exports = createBundle;
