process.env.NODE_ENV = 'test'

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');
const expect = chai.expect;


chai.use(chaiHttp);
describe("Cards",()=>{
    it ("Should redirect to small image",async()=>{
			const srcImgUrl = `https://gateway.ipfs.io/ipfs/QmVa4pTXt6JiGtCAif6MMV32dFbZfJSwMzp6orVqbxVe1m`;
			const apiUrl = `/api/v1/cards/img`;
			const finalURL = `${apiUrl}?u=${encodeURIComponent(srcImgUrl)}`;
			console.log(finalURL);
			const resp = await chai.request(app).get(finalURL);
      expect(resp).to.have.status(200);
    })
})
