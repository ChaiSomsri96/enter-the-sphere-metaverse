process.env.NODE_ENV = 'test'

const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;

const app = require('../src/app');

const db = require('../models');
const uuid = require('uuid');
const generateWallet = require('../src/wallets/helpers/generateWallet.helper');
const generateBundleforUser = require('../src/bundles/helpers/generateBundle.helper');
const openBundleFn = require('../src/bundles/helpers/openbundle.helper');

const transferCtrl = require('../src/cards/controllers/transfer-card.controller');

const config = require('../src/config');

chai.use(chaiHttp);

describe("Bitcoin", function() {

	const testUID = Math.floor(Math.random() * 10000); //uuid.v4();
	const testPurchaseID = testUID;//uuid.v4();

	describe("Create wallet", function (){

		it("Should create wallet", async function(){

			this.timeout(2500000);

			try {

				const user = await db.User.create({id: testUID});
				await db.Purchase.create({id: testPurchaseID, userId: testUID});
				await chai.request(app).post('/api/v1/cards/generate');

				const wallet = await generateWallet(testUID)
				console.log("generate wllet");
				if (wallet==null){
					throw "wallet should be generated";
				}
				console.log(`Generating bundle for ${testUID}, purchase:${testPurchaseID}`);

				const bundleCards = await generateBundleforUser(testUID, testPurchaseID,1);


					assert.exists(bundleCards.bundleId, "generated bundle should have and ID");
					assert.isNotEmpty(bundleCards.cards, "generated bundle should have a list of selected cards");

					if (typeof bundleCards.bundleId==='undefined') {
						throw "bundleid is empty";
					}

					if (Array.isArray(bundleCards.cards)==false || bundleCards.length==0){
						throw "bundle cards is empty";
					}

				console.log(`Opening bundle ${bundleCards.bundleId}`);
				const finalCards = await openBundleFn(bundleCards.bundleId)
				console.log("Bundle open done");
				assert.isNotEmpty(finalCards,'openBundle should return selected cards')
				const destination = config.cashAddress

				console.log(`waiting for 10 seconds to give some time for transactions`);
				await new Promise(resolve=>setTimeout(resolve,10000));
				console.log(`Transfering card from ${wallet.cashAddress} to ${destination}, card: ${finalCards[0].tokenId}`);
				const txid = await transferCtrl.transferCard(user.uuid, finalCards[0].tokenId, destination);
				assert.lengthOf(txid,64,"should return valid transaction id");
				console.log(`Transfer transaction id: ${txid}`);
				
				return txid;
			}catch(ex){
				assert.fail(ex);
			}
		})
	});

	/*	describe("Open box", function() {
			it("Should make token for user", function(){

			});
		});*/
});
