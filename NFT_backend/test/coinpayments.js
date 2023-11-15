process.env.NODE_ENV = 'test'

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');
const db = require('../models');

const assert = chai.assert;

chai.use(chaiHttp);

describe("Coinpayments",()=>{
	it("Should generate cards",async ()=>{
		await chai.request(app).post('/api/v1/cards/generate');
	}).timeout(10000);

	it("Should return checkout link", async ()=>{

		const userRespHttp = await chai.request(app)
			.post('/api/v1/users/')
			.set('content-type', 'application/json')
			.send({
				firstName: 'test',
				lastName: 'test',
				email: 'noreply@enter-the-sphere.com',
				password: 'Qwe12312#',
			});

		const userResp = userRespHttp.body;
		assert.isNotEmpty(userResp.uuid)

		// txReqResp should have format: 
		// https://www.coinpayments.net/apidoc-create-transaction 
		// API Response
		const txReqRespHttp = await chai.request(app)
			.post('/api/v1/payments/crypto/create-payment-session')
			.set('content-type','application/json')
			.send({userId: userResp.uuid, quantity: 2})
		const txReqResp = txReqRespHttp.body;

		assert.isNotEmpty(txReqResp.checkout_url);
		assert.isNotEmpty(txReqResp.txn_id);

		//it("Should generate bundles on IPN request", async()=>{

		console.log('emulating IPN');
		await chai.request(app)
			.post('/api/v1/payments/crypto/ipn')
			.set('content-type','application/json')
			.send({
				status: 100,
				txn_id: txReqResp.txn_id,
		});

		const user = await db.User.findOne({where:{uuid: userResp.uuid}});
		console.log(`User id: ${user.id}`);

		const bundles = await db.Bundle.findAll({where: {userId: user.id}});
		console.log(`User bundles :${bundles}`);

		assert(bundles.length, 2, "should be 2 bundles");
//		})
	}).timeout(20000)
})


