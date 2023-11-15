const {fetchBCHBalance, transferBch} = require('../../../tokens/controllers/child-tokens/child-nft.helper');
const db = require('../../../../models');


// Should be authorized user.
// Parameters{
// 	body: {
// 		dest: string (BCHAddress destination
// 	}
// 	
const withdrawBCH = async(req, resp, next)=>{

	try {
	const safeWallet = await db.SafeWallet.findOne({where:{userId: req.user_id}});
	if (safeWallet==null) {
		throw new Error('no wallet');
	}


	const balance = await fetchBCHBalance(safeWallet.cashAddress);

	if (balance < 5000) {
		throw new Error('balance too low');
	}

	const txid = await transferBch(safeWallet.cashAddress, req.body.dest, balance);

	resp.json({txid}).status(200);
		return;
	}catch(err){
		console.error(err);
		next(err);
	}
}

module.exports = withdrawBCH;
