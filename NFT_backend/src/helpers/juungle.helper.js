const config = require('../config');
const axios = require('axios');
const jurl=(url)=>`https://www.juungle.net/api/v1${url}`;

let cachedJWT = "";
let cachedUntil = 0;

// loginJuungle returns Valid token
const JuungleJWT = async ()=>{

	if ((new Date()).getTime() > cachedUntil){
		
		const loginPayload = {
			email: config.juungleEmail, 
			password: config.juunglePassword,
		};

		const resp = await axios.post(jurl('/user/login'), loginPayload);

		if (resp.status!=200){
			console.error('unable to login to juungle')
			return "";
		}

		cachedJWT = resp.data.jwtToken;
		cachedUntil = ((new Date()).getTime())+1000*3600; // 1 hour cache

	}

	return cachedJWT;
}

module.exports={JuungleJWT};
