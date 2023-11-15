const generateCardsSchema = require("../schemas/generateCards.schema");
const data = require("../data/cards.json");
const db = require("../../../models");
const generateGroupTokenHelper = require("../../tokens/controllers/group-tokens/helpers/generateGroupToken.helper");
const {fetchSLPBalances} = require("../../tokens/controllers/child-tokens/child-nft.helper");
const config = require(".././../config");

const generateCardsController = async (req, res, next) => {
	// #swagger.tags = ['Cards']
	// #swagger.description = ['Endpoint to generate cards and add them into database. Optionally it can regenerate tokens as well. This method works only once and would do nothing if called multiple times']
	/* #swagger.parameters['body'] = {
	 		in: "body",
			required: no,
			schema: { $ref: "#/definitions/GenerateCardsRQ" }
	  } */
  try {

		// run only once
		const oldCards = await db.Card.findAll()
    const dataArr = JSON.parse(JSON.stringify(data));
	

    // get card data
		const regenerateTokens = req.body.regentokens==="true" || req.body.regentokens===true;
    console.log(`Total Cards in array: ${dataArr.length}`);

		
    if (dataArr) {

			if (oldCards.length >= dataArr.length){
				res.json([]).status(200);
				return
			}

			let balancesMap = null;
			if (!regenerateTokens) {
				balancesMap = await fetchSLPBalances(config.cashAddress);
			}

      // run the loop over the array
			let idx = 0;
      for (let card of dataArr) {
				if (idx < oldCards.length) {

          idx++;
					continue;
				}

        idx++;

        let token = {
          tokenName: [card.name, config.cardSuffix, `(${config.tokenEpoch})`].join(' '),
          tokenSymbol: config.tokenTicker,
          documentUri: card.cardImg,
          documentHash: "",
          totalSupply: card.totalSupply,
        };
        console.log(`generate ${card.name} with ${card.tokenId}`);
        // within array first create group token for each and put test genesis at the end of each group card.
				let groupToken = null;
				if (regenerateTokens) {
         groupToken = await generateGroupTokenHelper(token);
				}

        let tokenId = card.tokenId;

        if (groupToken!=null){
          tokenId = groupToken.tokenTx;
        }

        const cardData = await db.Card.create({
          name: [card.name, config.cardSuffix].join(' '),
          type: card.type,
          rarity: card.rarity,
          cost: card.cost,
          shortDesc: card.shortDesc,
          desc: card.desc,
          cardImage: card.cardImg,
          mechanicStatus: card.mechanicStatus,
          totalSupply: card.totalSupply,
          currentSupply: card.totalSupply,
          phase: "pre-alpha",
          // tokenId: groupTokendata.tokenTx,
          gameCardId: card.id,
          tokenId: tokenId,
          chance: card.chance,
          illustration: card.illustration,
        });


				if (balancesMap!=null) {
					// TODO: collect totalSupply from network as well
					cardData.currentSupply = (balancesMap[cardData.tokenId]||0);
					cardData.update({currentSupply: balancesMap[cardData.tokenId]||0});
				}
        // console.log("token-created", groupTokendata);
      }
    } else {
      throw new Error("Unable to read cards data file");
    }

    // once group token is created save the details of the group token in the db

    const allCards = await db.Card.findAll();

		console.log(`Total cards in database: ${allCards.length}`);

    res.json(allCards).status(201);
  } catch (error) {
		console.error(`Failed to register cards on database: ${error}`);
    next(error);
  }
};

module.exports = generateCardsController;
