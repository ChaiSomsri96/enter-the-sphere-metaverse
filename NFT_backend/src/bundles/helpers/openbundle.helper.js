const db = require('../../../models');
const scheduleMint = require('../../jobs/mint-cards.job');


const openBundle = async (uuid)=>{
    // console.log("user", user);
    const userBundles = await db.Bundle.findOne({
      where: {
        uuid,
      },
    });

    console.log("id", userBundles.userId);
    const user = await db.User.findOne({
      where: {
        id: userBundles.userId,
      },
    });
    console.log('user', user)

    // console.log("bundleId", bundleId);

    const receiver = await db.SafeWallet.findOne({
      where: {
        userId: user.id,
      },
    });

    const userCards = await db.BundledCard.findAll({
      where: {
        bundleId: userBundles.id,
      },
    });

    const finalCards = [];
    for (let card of userCards) {
			const getCard = await db.Card.findOne(
				{where: {id: card.cardId}})
     	finalCards.push(getCard)
		}

	await	scheduleMint(userCards, receiver.cashAddress, user.id);
//		transferTokens(userCards);

    const updateBundle = await db.Bundle.update(
      { status: "opened" },
      {
        where: {
          id: userBundles.id,
        },
      }
    );

	return finalCards;
}

module.exports = openBundle;
