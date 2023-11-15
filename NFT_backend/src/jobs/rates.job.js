const axios = require('axios')
const redis = require('../helpers/redis.helper');

let PriceValidTo = 0;

const ratesKey = 'exchange-rates';

const BCHRateTo = async(dst)=>{
	const now = (new Date()).getTime();

	if (now > PriceValidTo){
		await updateRates();
		PriceValidTo = now+60*1000;	//	1 minute valid cache
	}

	return await redis.hget(ratesKey, dst);
}

const updateRates = async ()=>{

	const resp =await axios.get('https://api.coinbase.com/v2/exchange-rates?currency=BCH');

	if (resp.status!==200){
		console.error('unable to retrieve coinbase exchange rates');
		return;
	}

	const rates = resp.data.data.rates;

	await redis.hset(ratesKey, rates);
}

const scheduleUpdateRates=(interval)=>{

	setInterval(()=>updateRates(), interval*1000);

}

module.exports={BCHRateTo, updateRates,scheduleUpdateRates}
