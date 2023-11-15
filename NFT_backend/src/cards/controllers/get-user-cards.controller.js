const { string } = require("joi");
const db = require("../../../models");

const getUserCards = async (req, res, next) => {
  try {
    console.log("hit");
    const telegramId = req.query.telegramId;
    const user = await db.User.findOne({
      where: { telegramId },
    });
    const wallet = await db.SafeWallet.findOne({
      where: {
        userId: user.id,
      },
    });
    console.log("wallet", wallet);

    // get user's address from user tg id
    // userSlpAddr = "simpleledger:qrhfzdnkpg0u46vryrv5y6nkjyklufw7su9nfkfupu";  // FIXME: do a db query, hardcoded fro example
    userSlpAddr = wallet.slpAddress;

    // get user's cards from slpdb, using the following jq query for slpdb
    const slpdb_query = {
      v: 3,
      q: {
        db: ["g"],
        aggregate: [
          {
            $match: {
              "graphTxn.outputs.address": userSlpAddr,
            },
          },
          {
            $unwind: "$graphTxn.outputs",
          },
          {
            $match: {
              "graphTxn.outputs.address": userSlpAddr,
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

    // fetch data from slpdb (first, base64 encode the query)
    const data = Buffer.from(JSON.stringify(slpdb_query)).toString("base64");
    const config = {
      method: "GET",
      url: "https://bchd.fountainhead.cash/q/" + data, // FIXME: move host to config file
    };
    const response = (await axios(config)).data;
    const userCards = response.g; // NOTE: This is will include both confirmed/unconfirmed items

    // loop through the user's cards results array and map these cards to organize the user's cards
    // by card id. The map keys represent the card ids (types of cards), each key has a list of NFT
    // ids representing individual cards.
    const userTokens = {};
    for (const card in userCards) {
      if (!userTokens[card.groupTokenId]) {
        userTokens[card.groupTokenId] = [];
      }
      userTokens[card.groupTokenId].push(card.tokenIdHex);
    }

    // return the results
    res.json(userTokens).status(200);
  } catch (error) {
    next(error);
  }
};

module.exports = getUserCards;
