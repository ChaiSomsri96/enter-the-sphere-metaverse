const db = require('../../models');
const config = require('../config');
const redis = require('../helpers/redis.helper');
const FEE = 0.04;

const {transferBch} = require('../tokens/controllers/child-tokens/child-nft.helper');

const jurl=(url)=>`https://www.juungle.net/api/v1${url}`;
const {JuungleJWT} = require('../helpers/juungle.helper');

const axios = require('axios');

const resolveJuunglepayout = async (safeWallet, payoutRecord)=>{

	try{
		const juungleNft  = JSON.parse(payoutRecord.marketplacepayload);
		const amount = juungleNft.priceSatoshis * (1.0-FEE);
		const txid = await transferBch(
			config.cashAddress, 
			safeWallet.cashAddress,
			amount, 
			config.privateKey);

		return txid;
	}catch(ex){
		console.error(ex);
	}

	return "";
}

const stepLocked=async()=>{

	const records = await db.PayoutMarketplace.findAll({

		where: {

			done: false,
				
		}

	})


	records.forEach(async (el)=>{

		if (el.marketplace=='juungle'){


			const targetUser = await db.User.findOne({where: {uuid: el.sphereuserid}})

			if (targetUser==null) {
	
				return;

			}

			const safeWallet = await db.SafeWallet.findOne({where: {userId: targetUser.id}});

			if (safeWallet==null){
				
				return;
			
			}
		
			const payouttx = await resolveJuunglepayout(safeWallet, el)
			if (""!=payouttx){
				await el.update({
					done: true,
					payouttx: payouttx,
				})
			}



		}

	})

}

const step = async()=>{

	console.log('Payouts Step');
	const res = await redis.get('payouts-lock');

	if (res==null){
	
		try {
		
			stepLocked()
	
		}catch(ex){

			console.error(ex);

		}
		finally{

			redis.del('payouts-lock');
		
		}
	}

}

const juungleWithdrawal=async ()=>{

	console.log('Withdrawal step');

	const payload = {
		password: config.juunglePassword,
		toAddress: config.cashAddress,
	};

	const response = axios.post(jurl('/user/withdraw_bch'),payload,{
			headers: {
				'X-Access-Token': await JuungleJWT()
			}
		}
	);

	if (response.status==422){
		// nothing to withdraw
		return;
	}

	if (response.status!=200){
		console.error('failed to withdraw_bch from juungle', response);
	}
}


const PayoutInterval = 3600;	//	60 minutes
const JuungleWithdrawalInternal = 1800; // 30 minutes


const schedulePayouts=(interval=>{
	if (!(typeof interval === 'number' && interval > 0 )){
		interval = PayoutInterval;
	}

	console.log('schedule payouts',interval)
	setInterval(async ()=>{ await step()},1000*interval);
})


const scheduleJuungleWithdrawals=(interval=>{
	if (!(typeof interval === 'number' && interval > 0 )){
		interval = JuungleWithdrawalInternal;
	}

	console.log('schedule juungle withdrawal',interval);
	setInterval(async ()=>{ await juungleWithdrawal()}, 1000 * interval);
})


module.exports={scheduleJuungleWithdrawals, schedulePayouts};
