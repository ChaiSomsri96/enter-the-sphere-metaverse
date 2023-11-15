const {Queue, Worker} = require ('bullmq');
const { createChildToken } = require("../tokens/controllers/child-tokens/child-nft.helper");
const mintCardQueueName = 'mint-cards-queue';
const config = require('../config');

const mintQueue = new Queue(mintCardQueueName, {
	connection: {
		host: config.redisHost,
		port: 6379,
	}
});

const mintWorker = new Worker(mintCardQueueName, async (job)=>{
	try {
		let cnt=0;
		const cards = job.data.cards;
		const receiverCashAddress = job.data.receiverCashAddress;
		const userId = job.data.userId;

		for (let card of cards) {
			// generate NFT tokens
			const tokenObj = {
				receiver: receiverCashAddress,
				userId: userId, 
				bundleCardId: card.id,
				cardId: card.cardId,
			};

			try {
				cnt++;
				console.log(`Creating token for card no ${cnt}/${cards.length}`);

				await createChildToken(tokenObj);
				

				console.log(`Card no ${cnt}/${cards.length} Done`);
			}catch(error){
				console.error(error);
			}
		}
		return finalCards;
	}catch(error){
		return error;
	}
}, {
	concurrency: 1, 
	connection: {
		host: config.redisHost,
		port:6379,
	}});


const scheduleMint = async (cards, receiverCashAddress, userId)=>{
	await mintQueue.add('mint',{
		cards,
		receiverCashAddress,
		userId,
	});
}

module.exports = scheduleMint;
