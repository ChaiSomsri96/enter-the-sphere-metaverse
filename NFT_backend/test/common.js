const request = require("supertest");
const app = require('../src/app');

async function genericGet(
    url, // string
    data = {}, // object
    jwtToken = null, // string|null
    expectedHttpCode = 200 // number?
) {
    return new Promise((resolve, reject) => {
        request(app)
            .get(url)
            .query(data)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${jwtToken}`)
            .expect('Content-Type', /json/)
            .expect(expectedHttpCode)
            .end((e, res) => {
                if (e) {
                    return reject(e);
                }

                return resolve(res.body);
            });
    });
}

async function genericPost(
    url,
    data = {},
    jwtToken = null,
    expectedHttpCode = 200
) {
    return new Promise((resolve, reject) => {
        request(app)
            .post(url)
            .send(data)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${jwtToken}`)
            .expect('Content-Type', /json/)
            .expect(expectedHttpCode)
            .end((e, res) => {
                if (e) {
                    console.log(e);
                    return reject(e);
                }

                return resolve(res.body);
            });
    });
}

module.exports.genericGet = genericGet;
module.exports.genericPost = genericPost;
