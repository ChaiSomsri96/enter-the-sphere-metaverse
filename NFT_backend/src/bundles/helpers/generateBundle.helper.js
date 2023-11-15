const db = require("../../../models");
const config = require("../../config");

const {fetchSLPBalances} = require("../../tokens/controllers/child-tokens/child-nft.helper");

let supplyValidatedAt = null;
// generateBundleforUser returns object with { bundleId, cards } 
// bundleId is uid of generated bundle
// cards is array with selected cardsa
// numberOfCards is how many cards should be in bundle. currently it is limited >=1 and <= 50
const generateBundleforUser = async (userId, purchaseId, numberOfCards) => {
  try {
    // create bundle
		//
		//
		let resp = {bundleId: null, cards: []};

		// Verify number of cards
		if (typeof numberOfCards !== 'number'){
			numberOfCards = 5;
		}

		if (numberOfCards<1) {
			return resp;
		}

		if (numberOfCards>50) {
			numberOfCards = 50;
		}

    const bundleObj = {
      userId: userId,
      price: 2,
      isOpened: false,
      purchaseId: purchaseId,
    };
		//	-Verify number of cards
		//
		//	Verify supply once in 10 minutesa
		const now = new Date().getTime()
		try {
			if (supplyValidatedAt == null || 
				(now-supplyValidatedAt)>10*3600*1000 ){

				console.log(`Updating supplies, takes a few seconds`);

				const mappedBalances = await fetchSLPBalances(config.cashAddress);

					const dbCards = await db.Card.findAll();
				for (let card of dbCards) {
					const tokensLeft = (mappedBalances[card.tokenId] || 0);
					await card.update({currentSupply: tokensLeft })

					console.log(`updated card ${card.id} for token ${card.tokenId}. remained ${tokensLeft} of ${card.totalSupply}`)
				}
			}

			supplyValidatedAt = now;
		}catch(error){
			console.error(error);
		}

    // create bundle
    const bundle = await db.Bundle.create(bundleObj);
    // get list of cards from db
    const cards = await db.Card.findAll();
//    console.log("cards", cards);
    const itemDrps = new WeightedRandomBag();

		let totalSupplyInPlay = 0;

    for (let i = 0; i < cards.length; i++) {
			if (cards[i].currentSupply > 0){
				console.log(`add entry ${cards[i].uuid} with chance ${cards[i].chance}`);
				totalSupplyInPlay+=cards[i].currentSupply;
	      itemDrps.addEntry(cards[i], cards[i].chance);
			}
    }
    const selectedCards = [];

		if (totalSupplyInPlay < numberOfCards){
			console.log(`not enough tokens left to create a new bundle. ${totalSupplyInPlay} left. ${numberOfCards} required`);
			res.status(500);
			return;
		}

    // drawing random entries from it
		let safetyTrigger = 100;
    for (let i = 0; i < numberOfCards && safetyTrigger>0; i++,safetyTrigger--) {
      let current = itemDrps.getRandom();
			console.log(` rnd selected[${i}]: ${current.uuid}`)
      if (current.currentSupply === 0) {
        i--;
      } else {
        current.currentSupply = current.currentSupply - 1;
        selectedCards.push(current);
    //    console.log("current", current);
        const currentCardObj = await db.Card.findOne({
          where: {
            uuid: current.uuid,
          },
        });
   //     console.log("currentCardObj", current);

        const bundleCard = await db.BundledCard.create({
          cardId: currentCardObj.id,
          bundleId: bundle.id,
          userId: userId,
          parentToken: currentCardObj.tokenId,
          phase: "pre-alpha",
          status: "unopended",
        });
 //       console.log("bundleCard", bundleCard);

        let currentCard = await db.Card.findOne({
          where: {
            uuid: currentCardObj.uuid,
          },
        });

        await db.Card.update(
          {
            currentSupply: currentCard.currentSupply - 1,
          },
          {
            where: {
              uuid: currentCardObj.uuid,
            },
          }
        );
      }
    }

		console.log(`Bundle ${bundle.uuid}`)
		selectedCards.forEach(c=>{
			console.log(`  - ${c.uuid} | ${c.name}: ${c.tokenId}`);
		})

		return {bundleId: bundle.uuid, cards: selectedCards};
  } catch (error) {
    throw error;
  }
};

const WeightedRandomBag = function () {
  var entries = [];
  var accumulatedWeight = 0.98;

  this.addEntry = function (object, weight) {
    accumulatedWeight += weight;
    entries.push({ object: object, accumulatedWeight: accumulatedWeight });
  };
  this.entries = entries;
  this.getRandom = function () {
    var r = Math.random() * accumulatedWeight;
    return entries.find(function (entry) {
      return entry.accumulatedWeight >= r;
    }).object;
  };
};
module.exports = generateBundleforUser;
