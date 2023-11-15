
process.env.NODE_ENV = 'test'

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');
const db = require('../models');

const assert = chai.assert;
const expect = chai.expect;
chai.use(chaiHttp);

describe("Bundles", ()=>{

	const email = 'test@test.com';
	const password = 'test12312#';

	const http = chai.request.agent(app);

	it ("Should create bundles", async function(){
		
			const auth = await http.post('/api/v1/auth/register').send({email: email, password: password,firstName: 'sample', lastName: 'sample'})
			expect(auth.status).to.equal(200);
			const user = await db.User.findOne({where:{uuid: auth.body.uuid}});

			// Generate cards
			await http.post('/api/v1/cards/generate/');

			// Should be logged in as admin
			console.log("Send Cards");
			const cards = await http.post('/api/v1/bundles/')
				.set('Authorization', `Bearer ${auth.body.jwtToken}`)
				.send({userId: user.uuid, quantity:3});
			console.log("cards received");

			expect(cards.status).to.equal(200);
			assert(cards.body.length, 3, "should return 3 cards");

			const bundles = await http.get(`/api/v1/bundles/users/${user.uuid}`);

			console.log('bundles');
			console.log(bundles.body);

			assert(bundles.body.length,1,"should return 1 bundle");
			expect(bundles.status).to.equal(200);
		
	});
})
