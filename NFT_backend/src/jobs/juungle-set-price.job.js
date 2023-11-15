const db = require('../../models');
const config = require('../config');
const axios = require('axios');
const jurl=(url)=>`https://www.juungle.net/api/v1${url}`;

const {JuungleJWT} = require('../helpers/juungle.helper');

const loginJuungle = async()=>{

	return await JuungleJWT();
	
}

const listedToken=async(el, cachedTokens, extraQuery)=>{
	const marketplaceUid = el.marketplaceUserId;
	let marketplaceTokens = cachedTokens[marketplaceUid];

	if (typeof extraQuery!=='string') {
		extraQuery='';
	}

	if (false==Array.isArray(marketplaceTokens)){
		const resp = await axios.get(jurl(`/nfts?userId=${marketplaceUid}${extraQuery}`));

		if (resp.status!=200){
			console.error('failed to list spheres nft from juungle')
			return;
		}else{
			marketplaceTokens = resp.data.nfts;
			cachedTokens[marketplaceUid]=marketplaceTokens;
		}
	}

	const listed = marketplaceTokens.filter(listed=>listed.tokenId===el.tokenId)

	return listed;

}

// creates unique payout record for marketplace purchase transaction id.
// It does not perform any blockchain or withdrawal transactions
// @param el {TokenOwnership} record
// @param cachedNfts {Map} temporary cache to keep marketplace nft records to reduce round trips
const processSoldToken = async(el, cachedNfts)=>{
	const juungleNft = await listedToken(el, cachedNfts, '&purchaseTxidSet=true');
	
	if (juungleNft.length!=1) return;

	const existingTx = await db.PayoutMarketplace.findOne({
		where:{
			marketplacetxkey: juungleNft[0].purchaseTxid, 
			marketplace: 'juungle',
		},
	});

	if (existingTx!=null) {
		return;
	}

	await db.PayoutMarketplace.create({

			marketplace: 'juungle',

			marketplacetxkey: juungleNft[0].purchaseTxid,

			sphereuserid: el.userId,

			tokenid: el.tokenId,

			marketplacepayload: JSON.stringify(juungleNft[0]),

	});
}

const processOwnedToken = async(el, cachedNfts, juungleJwtToken)=>{
		const listed = await listedToken(el, cachedNfts,'');

		if (listed.length!=1) return;

		// set price , update token ownership
		const setPriceResp = await axios.post(jurl('/user/nfts/set_price'),{nftId: listed[0].id, priceSatoshis: el.price},{
			headers: {
				'X-Access-Token': juungleJwtToken,
			}
		});

		if (setPriceResp.status!=200){
			console.error('unable to set price for nft on juungle');
			return;
		}

		el.update({
				listed:true,
		})
		
	};

const doSetPriceCycle = async()=>{

	console.log('setPrice worker started');

	const tokens = await db.TokenOwnership.findAll({
		where: {
			listed: false,
			completed: false,
			marketplace: 'juungle',
		}
	})

	const juungleJwtToken = await loginJuungle(); 
	const cachedNfts = {};

	tokens.forEach(async el=>{
		try {
			await processOwnedToken(el,cachedNfts, juungleJwtToken);
		}catch(ex){
			console.error(ex);
		}
	})
}

const doCheckSales = async()=>{
	// check if last 
	// Get userID from juungle
	const jwtToken = await loginJuungle();

	const userDetails = await axios.get(jurl('/user/details'),{headers: {'X-Access-Token': jwtToken}});
	if (userDetails.status!=200){
		console.log("Failed to connect user details");
		return;
	}

	const cachedTokens = {}

	const tokens = await db.TokenOwnership.findAll({where:{listed:true,completed: false, marketplace: 'juungle'}})
	tokens.forEach(async el=>{
		try {
			processSoldToken(el, cachedTokens)
		}catch(ex){
			console.error(ex);
		}
	});

}

const setPriceIntervalSeconds = 60;	// Increase in production
const checkSalesIntervalSeconds = 60; // Increase in production

setInterval(()=>{doSetPriceCycle()},setPriceIntervalSeconds*1000);
setInterval(()=>{doCheckSales()},checkSalesIntervalSeconds*1000);

console.log('setpricequeue done')
