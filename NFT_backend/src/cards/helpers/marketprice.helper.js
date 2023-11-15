const redis = require('../../helpers/redis.helper');
const {BCHRateTo} = require('../../jobs/rates.job');

const marketPrice = async(tokenId)=>{
	let cost = await redis.get('cache:cardprice:'+tokenId)

	if (typeof cost === 'string' || typeof cost === 'number'){
		const BCHExchange = await BCHRateTo('USD');
		cost = (parseInt(cost)/1e8)*BCHExchange;
		cost = Math.round((cost + Number.EPSILON) * 100) / 100;
		return cost;
	}

	return null;
}

module.exports = marketPrice;
