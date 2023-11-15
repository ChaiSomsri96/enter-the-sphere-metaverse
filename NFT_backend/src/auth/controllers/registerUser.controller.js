const jwt = require("jsonwebtoken");
const db = require("../../../models");
const registerSchema = require("../schemas/register.schema");
const Role = require("../helpers/role.helper");
const config = require("../../config");
const bcrypt = require("bcrypt");
const authService = require("../helpers/authservice.helper");
const generateWallet = require("../../wallets/helpers/generateWallet.helper");

const registerUserController = async (req, res, next) => {
  // #swagger.tags = ['Auth']
  // #swagger.description = ['Endpoint to login user']
  /* #swagger.parameters['body'] = {
    in: "body",
    required: true,
    schema: { $ref: "#/definitions/RegisterUser" }
  } */
  try {

    const body = await registerSchema.validateAsync(req.body);
    const ipAddress = req.ip;
    const origin = req.get("origin");
    const { firstName, lastName, email, telegramId, password } = body;

    const dbUsers = await db.User.findOne({
      where: {
        email: email,
      },
    });
    if (dbUsers) {
      throw new Error(
        "You are already registered with this email. Try to login into the site."
      );
    }
    const role = Role.User;

    // hashing password
    const hashPassword = await bcrypt.hash(password, 10);
    console.log("hashed", hashPassword);
    const user = await db.User.create({
      firstName,
      lastName,
      email,
      password: hashPassword,
      role,
      telegramId,
      emailVerified: true,
      active: true,
      verificationToken: await authService.randomTokenString(),
    });

    const uuid = user.uuid;
    console.log("id", user.uuid);
    const authRes = await authService.authenticate({
      uuid,
      password,
      ipAddress,
    });
    console.log("authRes", authRes);

    const safeWallet = generateWallet(user.id);

    authService.setTokenCookie(res, authRes.refreshToken);

    await authService.sendVerificationEmail(user, origin);

    res.json(authRes).status(201);
  } catch (error) {
    next(error);
  }
};

module.exports = registerUserController;
