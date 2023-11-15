const axios = require('axios');
const {transferToken} = require("../../tokens/controllers/child-tokens/child-nft.helper"); 
const jurl = (url)=>`https://www.juungle.net/api/v1${url}`;
const config = require('../../config');

const getUserCardToken = require('../helpers/get-user-cards.helper');
const db = require('../../../models');

const job = require('../../jobs/juungle-set-price.job');

const redis = require('../../helpers/redis.helper');
const {JuungleJWT} = require('../../helpers/juungle.helper');

const sellToken = async (userId, parentTokenId, sellprice)=>{
	
	// https://docs.juungle.net/2-endpoints/authentication.html#login
	
	const user = await db.User.findOne({
		where: {
			uuid: userId, 
		}
	});

	if (user==null){
		throw("internal error");
	}

	const safeWallet = await db.SafeWallet.findOne({
		where: {
			userId: user.id,
		},
	})

	if (safeWallet==null){
		throw("internal erorr");
	}
	// find instance of token with same cardid 

	const userTokenId = await getUserCardToken(user.id, parentTokenId);
	const loginPayload = {email: config.juungleEmail, password: config.juunglePassword};
	const token = await JuungleJWT();
	console.log('token',token);
	const detailsResp = await axios.get(jurl('/user/details'),{
		headers: {
			'X-Access-Token': token,
		}
	});


	if (detailsResp.status!=200){
		console.error(detailsResp.statusText);
		throw('internal error')
	}


	const depositAddress = detailsResp.data.depositAddress;


	// Transfer token from User wallet to Juungle
	const tx = await transferToken(userTokenId, 
		// Token From -> To
		safeWallet.slpAddress, depositAddress, 
		safeWallet.privateKey,

		// BCH From
		config.cashAddress, config.privateKey,
	);

	if (tx==null){
		throw('unable to transfer token from user wallet to juungle deposit address')
	}

	// TokenOwnership should be processed by repeated cron-like job to set price as soon as token would be listed on Juungle
	// TokenOwnerhsip should be processed by repeated cron-like job to see if UTXO for tokenId changed on deposit address. such changes should be considered as sale, BCH should be received on 
	//
	//
	// https://docs.juungle.net/0-getting-started/#how-does-it-work
	// > If you would like to subscribe to this event, watch the blockchain for when your deposit NFT UTXO moves. This will be the sale, including your payment, unless you decide to withdraw it beforehand.
	//
	console.log(`userID: ${userId}`);

	sellprice = Math.round(parseFloat(sellprice));

	try {
		console.log('parenttokenid', parentTokenId);
		console.log('sellprice', sellprice);
		console.log('redis', redis);
		redis.set(`cache:cardprice:${parentTokenId}`, sellprice)
		console.log('detailsResp', JSON.stringify(detailsResp.data));
		console.log('safeWallet', safeWallet);
	}catch(redisError){
		console.error(redisError);
	}
	const tokenown = db.TokenOwnership.create({
		tokenId: userTokenId, 
		userId: userId,
		price: sellprice,

		marketplaceUserId: detailsResp.data.id,

		listed: false,
		completed: false,

		marketplace: 'juungle',

		depositedAt: (new Date()).getTime(),
		depositedTo: depositAddress,
		depositedFrom: safeWallet.slpAddress,
	})

	console.log('tokenownership',tokenown);


		// For repeated setprice job
		//
		// By default when you deposit the price is unset and it will not be available for purchase. You must call an endpoint using the nftId you retrieved above. Using your JWT token, the nftId, and priceSatoshis you should call the /user/nfts/set_price route.
		//
		//
		// GET https://juungle.net/user/details -H 'X-Access-Token: ACCESS_TOKEN'
		// 
		// Transfer token to depositAddress
		//
		// run job, wait to set a price for token
		// curl -X POST https://www.juungle.net/api/v1/user/nfts/set_price \
 // --data '{
 //   "nftId": 42069,
 //   "priceSatoshis": 200000
//  }' \
//  -H 'X-Access-Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYxMTE3NDcyOCwiZXhwIjoxNjExNzc5NTI4fQ.IUDW9DeKsPTmJ8EupsprFV8UArqJcsNAbF_-IrxBG1Q=
	
}

const sellCardHandler = async (req,resp,next)=>{
	try {
		sellToken(req.user.id, req.body.tokenId, req.body.sellprice)

		resp.json().status(200);
	}catch(error){
		console.error(error);
		next(error);
	}
}


module.exports = {sellCardHandler}
