const db = require("../../../models");
const axios = require("axios");
const getUserCardsbyCard = async (req, res, next) => {
  try {
    const userUUID = req.body.userId;
    // const cardUUID = req.body.cardId;

    const user = await db.User.findOne({
      where: { uuid: userUUID },
    });

    const wallet = await db.SafeWallet.findOne({
      where: {
        userId: user.id,
      },
    });
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

    const cards = [];

    // fetch data from slpdb (first, base64 encode the query)
    const data = Buffer.from(JSON.stringify(slpdb_query)).toString("base64");
    const config = {
      method: "GET",
      url: "https://slpdb.fountainhead.cash/q/" + data, // FIXME: move host to config file
    };
    const response = (await axios(config)).data;
    const userCards = response.g; // NOTE: This is will include both confirmed/unconfirmed items

    const dbCards = await db.Card.findAll();
    console.log("dbCards", userCards);
    // const cards = [];

    for (let userCard of userCards) {
      for (let card of dbCards) {
        if (userCard.groupTokenId === card.tokenId) {
          console.log("id", card.gameCardId);
          cards.push(card);
        }
      }
    }

    res.json(cards).status(200);
  } catch (error) {
    next(error);
  }
};

module.exports = getUserCardsbyCard;
