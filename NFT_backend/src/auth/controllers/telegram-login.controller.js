const db = require("../../../models");
const Role = require("../helpers/role.helper");
const authService = require("../helpers/authservice.helper");
const bcrypt = require("bcrypt");
const generateWallet = require("../../wallets/helpers/generateWallet.helper");

const telegramResolve = async( req, res, next)=>{

  try {
    const user = await db.User.findOne({
      where: {
        telegramId: req.body.telegramId,
      }
    })

    if (user==null){
      return res.json().status(404);
    }

    const authRes = await authService.getById(user.id)

    return res.json(authRes).status(200);
  }catch(error){
    console.error(error);
    next(error);
  }

}

const telegramController = async (req, res, next) => {
  // #swagger.tags = ['Auth']
  // #swagger.description = ['Endpoint to login with telegram']
  /* #swagger.parameters['body'] = {
    in: "body",
    required: true,
    schema: { $ref: "#/definitions/TelegramLogin" }
  } */
  try {
		console.log("telegram login");
    const ipAddress = req.ip;
    const { first_name, id, last_name, username, hash } = req.body;
    console.log("do this");

    const ifUser = await db.User.findOne({
      where: {
        telegramId: id,
      },
    });
    const role = Role.User;
    //password is null
    const password =
      "06de16d7539821871df08cb8410dab166c7a11290ea74166607330d85944007b"; // TODO wtf is this
    const hashPassword = await bcrypt.hash(password, 10);

    if (ifUser === null) {
      console.log("do this again");
      const user = await db.User.create({
        firstName: first_name,
        lastName: last_name,
        email: null,
        password: hashPassword,
        role,
        telegramId: id,
        emailVerified: true,
        active: true,
      });
      const walletd = await generateWallet(user.id);
      console.log("walletd", walletd);
    }
    const dbUser = await db.User.findOne({
      where: {
        telegramId: id,
      },
    });

    const uuid = dbUser.uuid;

    const compare = await bcrypt.compareSync(password, dbUser.password);

    if (!compare) {
      next("Password doesn't match");
    }

    console.log("dbUser.id", dbUser.uuid);
    const authRes = await authService.authenticate({
      uuid,
      password,
      ipAddress,
    });
    authService.setTokenCookie(res, authRes.refreshToken);

    res.json(authRes).status(201);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  telegramController,
  telegramResolve,
}
