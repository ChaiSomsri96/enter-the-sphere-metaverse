const {fetchBCHBalance} = require('../../../tokens/controllers/child-tokens/child-nft.helper');
const db = require('../../../../models');

const getBCHBalance = async(req, resp, next)=>{

	try {
	const safeWallet = await db.SafeWallet.findOne({where:{userId: req.user_id}});

	if (safeWallet==null) {
		throw new Error('no wallet')
	}

	const balance = await fetchBCHBalance(safeWallet.cashAddress);

	resp.json({balance}).status(200);
	return;
	}catch(err){
		console.error(err);
		next(err);
	}

}

module.exports = getBCHBalance;
