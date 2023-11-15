const db = require("../../../models");
const axios = require("axios");
const { slpAddress } = require("../../config");
const Sequelize = require('sequelize');
const marketPrice = require('../helpers/marketprice.helper');

const getCards = async (req, res, next) => {
  try {
    const telegramId = req.query.telegramId;
    const address = req.query.address;

    let page = 1;

    let limit = 20;
    if (req.query.page) {
      page = req.query.page;
    }

    if (req.query.limit) {
      limit = req.query.limit;
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    let cards = [];
    let userSlpAddr;

    if (telegramId || address) {
      if (telegramId) {
        const user = await db.User.findOne({
          where: { telegramId },
        });

        const wallet = await db.SafeWallet.findOne({
          where: {
            userId: user.id,
          },
        });
        userSlpAddr = wallet.slpAddress;
        console.log("slp", slpAddress);
      }

      // get user's address from user tg id
      // userSlpAddr = "simpleledger:qrhfzdnkpg0u46vryrv5y6nkjyklufw7su9nfkfupu"; // FIXME: do a db query, hardcoded fro example

      if (address) {
        userSlpAddr = address;
      }
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
      console.log("https://slpdb.fountainhead.cash/q/" + data);
      const config = {
        method: "GET",
        url: "https://slpdb.fountainhead.cash/q/" + data, // FIXME: move host to config file
      };
      const response = (await axios(config)).data;
      const userCards = response.g; // NOTE: This is will include both confirmed/unconfirmed items
      // res.json(userCards).status(200);

      const dbCards = await db.Card.findAll();
      console.log("dbCards", userCards);
      // const cards = [];

      for (let userCard of userCards) {
        for (let card of dbCards) {
          if (userCard.groupTokenId === card.tokenId) {
            console.log("id", card.gameCardId);
            cards.push(card.gameCardId);
          }
        }
      }

      console.log("cards", cards);

      // loop through the user's cards results array   and map these cards to organize the user's cards
      // by card id. The map keys represent the card ids (types of cards), each key has a list of NFT
      // ids representing individual cards.
      // const userTokens = {};
      // for (const card in userCards) {
      //   if (!userTokens[card.groupTokenId]) {
      //     userTokens[card.groupTokenId] = [];
      //   }
      //   userTokens[card.groupTokenId].push(card.tokenIdHex);
      // }
      // cards.push(userTokens);
    } else {

			const searchName = req.query.name;
			if (typeof searchName==='string' &&	searchName.length > 1 ){
				cards = await db.Card.findAll({
					where: {
						name: { [Sequelize.Op.iLike]: `%${searchName}%` }
					}
				})
			}else{
	      cards = await db.Card.findAll();
			}
    }

    // if (telegramId) {
    //   const user = await db.User.findOne({
    //     where: { telegramId },
    //   });
    //   console.log("user", user);
    //   bundledCards = await db.BundledCard.findAll({
    //     where: { userId: user.id },
    //   });

    //   for (let card of bundledCards) {
    //     const newCard = await db.Card.findOne({
    //       where: {
    //         id: card.id,
    //       },
    //     });
    //     cards.push(newCard);
    //   }
    // } else {
    //   cards = await db.Card.findAll();
    // }
		//
		// connect prices
		//
	  //
	  //
	cards = await Promise.all(
		cards.map(async (c)=>{
			let cost = await marketPrice(c.tokenId);
			
			if (cost!=null){
				c.cost = cost;
			}

			return c;
		})
	);

    const results = cards.slice(startIndex, endIndex);
    res.json(cards).status(200);
  } catch (error) {
    next(error);
  }
};

module.exports = getCards;
