const request = require("supertest");

const chai = require("chai");
const expect = chai.expect;

const util = require('./common');


describe("Auth", function() {
    describe("Forgot Password", () => {
        it("Basic", async () => {
            return new Promise(async (resolve, reject) => {
                try {
                    const body = await util.genericPost('/api/v1/auth/forgot-password', {
                        email: 'example@example.com',
                    });
                    chai.assert.equal(body.message, 'test');
                    return resolve();
                } catch (e) {
                    return reject(e);
                }
            });
        });
    });
});
