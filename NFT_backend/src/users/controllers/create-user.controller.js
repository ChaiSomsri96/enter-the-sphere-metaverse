const db = require("../../../models");
const registerSchema = require("../../auth/schemas/register.schema");
const Role = require("../../auth/helpers/role.helper");
const bcrypt = require("bcrypt");
const authService = require("../../auth/helpers/authservice.helper");

const createUser = async (req, res, next) => {
  try {
    const body = await registerSchema.validateAsync(req.body);
    const ipAddress = req.ip;

    const { firstName, lastName, email, telegramId, password } = body;

    const dbUsers = await db.User.findOne({
      where: {
        email: email,
      },
    });
    if (dbUsers) {
      throw new Error("User already exist with the email provided");
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
    });

    const uuid = user.uuid;
    console.log("id", user.uuid);
    const authRes = await authService.authenticate({
      uuid,
      password,
      ipAddress,
    });
    console.log("authRes", authRes);

    authService.setTokenCookie(res, authRes.refreshToken);

    res.json(authRes).status(201);
  } catch (error) {
    next(error);
  }
};

module.exports = createUser;
