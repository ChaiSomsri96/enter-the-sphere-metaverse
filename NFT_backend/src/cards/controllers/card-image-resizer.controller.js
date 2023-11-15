const ImgixClient = require("@imgix/js-core");
const config = require("../../config");

const ClientInstance = new ImgixClient(
  {
    domain: 'eths.imgix.net',
    secureURLToken: config.imgixSecret,
  }
)

const cacheMap = {};

const cardImageResizer = async (req,res,next)=>{
  try {
		const srcUrl = req.query.u;
		let suggestedH = req.query.h;

		if (typeof suggestedH==='string'){
			suggestedH = parseInt(suggestedH);
		}

		if (typeof suggestedH!=='number'){
			suggestedH = 300;
		}

		const cacheKey = `${suggestedH}/${srcUrl}`;

		if (typeof cacheMap[cacheKey]==='string'){
			res.writeHead(302, {'Location': cacheMap[cacheKey]});
			res.end();
			return;
		}
		
    const url = decodeURIComponent(srcUrl);
    const newUrl = ClientInstance.buildURL(url, {h: suggestedH});

		cacheMap[cacheKey] = newUrl;

    res.writeHead(302, {'Location': newUrl});
    res.end();
  }catch(error){
    console.error(error);
    next(error);
  }
}

module.exports = cardImageResizer;
