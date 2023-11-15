const openBundleFn = require('../helpers/openbundle.helper');

const openBundle = async (req, res, next) => {
  try {
		const finalCards = await openBundleFn(req.params.id);
		console.log(`Bundle opened OK`);
		console.log(`Cards: ${JSON.stringify(finalCards)}`);
    res.json(finalCards).status(200);
  } catch (error) {
		console.error(`Failed to openBundle`);
		console.error(error);
    next(error);
  }
};

module.exports = openBundle;
