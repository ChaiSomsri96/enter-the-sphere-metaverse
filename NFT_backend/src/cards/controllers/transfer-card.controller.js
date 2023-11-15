const {transferToken} = require("../../tokens/controllers/child-tokens/child-nft.helper"); 
const config = require("../../config");
const db = require("../../../models");

const axios = require("axios");
// params: user.uuid, card.tokenId ( Not bundled card ), cashAddress destination
const transferCard = async (useruid, parentTokenId, destination)=>{
	try {
		const user = await db.User.findOne({
			where: {uuid: useruid},
		})

		if (user==null){
			throw("user not found");
		}

		const wallet = await db.SafeWallet.findOne({
			where:{userId: user.id}
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
        if (userCard.groupTokenId === parentTokenId) {

					tokenId = userCard.tokenId;
					break;

        }
    }

		if (tokenId==null){
			throw("card not found");
		}


		// Perform transfer Transaction on Network
		console.log(`about to transferToken(${tokenId}, ${wallet.cashAddress}, ${destination}, ${config.cashAddress})`)
		const tx = await transferToken(
			// TokenID
			tokenId, 

			// From which address to send ( cash address)
			wallet.cashAddress,

			// Where send to ( cash address )
			destination,

			// From-CashAddress Wif formatted private key
			wallet.privateKey,

			// From which address to pay fee BCH ( cash address)
			config.cashAddress,

			// From-Fee-BCHCashAddress Wif formatted private key
			config.privateKey);

		return tx;

	}catch (exception){
		throw exception;
	}
}

// POST request params:
// userId
// tokenId
// destination
const transferCardHandler = async (req, res, next) => {
	try {
		const tx = await transferCard(
			// user.uuid
			req.body.userId, 

			// parent token id, card.tokenId
			req.body.tokenId,

			// destination, cash address
			req.body.destination)
			
			res.json({tx}).status(200);
	}catch(exception) {
		throw exception;
	}
}

module.exports = {transferCard, transferCardHandler};
