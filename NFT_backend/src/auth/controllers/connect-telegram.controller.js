const db = require("../../../models");

const connectTelegram = async (req,res, next) => {
  // #swagger.tags = ['Auth']
  // #swagger.description = ['Endpoint to connect with telegram']
  /* #swagger.parameters['body'] = {
    in: "body",
    required: true,
    schema: { $ref: "#/definitions/TelegramConnect" }
  } */
 try {
		const telegramId = req.body.id+"";

	  const existingUser = await db.User.findOne({where: {telegramId}});

		if (existingUser==null){
			console.log(`assigning telegramId`)
			const uuid = req.user.id;
			const user = await db.User.update({
					telegramId
			}, {
				where: {uuid}
			})

			res.json(user).status(200)
			return;
		}else{
			console.log(`User with same telegramId already exist ${existingUser}`)
		}


    res.json({}).status(200)
 } catch (error) {
	 console.log(error)
     next(error)
 }   
}


module.exports = connectTelegram;
