const axios = require("axios");
const db = require('../../../models');

const getUserCardToken = async (userId, cardTokenId)=>{
	const wallet = await db.SafeWallet.findOne({
		where:{userId}
	});

	if (wallet==null){
		throw ("internal error");
	}


// get user's cards from slpdb, using the following jq query for slpdb
	const slpdb_query = {
		v: 3,
		q: {
			db: ["g"],
			aggregate: [
				{
					$match: {
						"graphTxn.outputs.address": wallet.slpAddress,
					},
				},
				{
					$unwind: "$graphTxn.outputs",
				},
				{
					$match: {
						"graphTxn.outputs.address": wallet.slpAddress,
						"graphTxn.outputs.status": "UNSPENT",
					},
				},
				{
					$lookup: {
						from: "tokens",
						localField: "tokenDetails.tokenIdHex",
						foreignField: "tokenDetails.tokenIdHex",
						as: "token",
					},
				},
			],
			limit: 10000,
		},
		r: {
			f:
				"[ .[] | {tokenId: .tokenDetails.tokenIdHex, groupTokenId: .tokenDetails.nftGroupIdHex } ]",
		},
	};

	const cards = [];

	// fetch data from slpdb (first, base64 encode the query)
	const data = Buffer.from(JSON.stringify(slpdb_query)).toString("base64");
	const axConfig = {
		method: "GET",
		url: "https://slpdb.fountainhead.cash/q/" + data, // FIXME: move host to config file
	};
	const response = (await axios(axConfig)).data;
	const userCards = response.g; // NOTE: This is will include both confirmed/unconfirmed items

	let tokenId = null;

	for (let userCard of userCards) {
			if (userCard.groupTokenId === cardTokenId) {
				tokenId = userCard.tokenId;
				break;
			}
	}

	if (tokenId==null){
		throw("card not found");
	}

	return tokenId;
}

module.exports=getUserCardToken;
