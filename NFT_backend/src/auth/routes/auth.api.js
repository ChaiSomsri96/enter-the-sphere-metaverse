const express = require("express");
const connectTelegram = require("../controllers/connect-telegram.controller");

const forgotPasswordController = require("../controllers/forgot-password.controller");
const loginController = require("../controllers/login.controller");
const refreshTokenController = require("../controllers/refresh-token.controller");
const registerUserController = require("../controllers/registerUser.controller");
const resetPasswordController = require("../controllers/reset-password.controller");
const revokeTokenController = require("../controllers/revoke-token.controller");
const telegram = require("../controllers/telegram-login.controller");
const verifyEmail = require("../controllers/verify-email.controller");
const router = express.Router();

const Role = require("../helpers/role.helper")
const authorize = require("../middlewares/authorize.middleware");

router.post("/forgot-password", forgotPasswordController);
router.post("/login", loginController);
router.post("/refresh-token", refreshTokenController);
router.post("/register", registerUserController);
router.post("/reset-password", resetPasswordController);
router.post("/revoke-token", revokeTokenController);
router.post("/verify-email", verifyEmail);
router.post("/telegram", telegram.telegramController);
router.post("/telegram/resolve", telegram.telegramResolve);
router.post("/telegram/connect", authorize(Role.User), connectTelegram);

module.exports = router;
