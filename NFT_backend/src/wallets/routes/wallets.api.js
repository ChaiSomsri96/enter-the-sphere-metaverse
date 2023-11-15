const express = require("express");
const createSafeWallet = require("../controller/safe-wallets/create-safe-wallet.controller");
const getUserSafeWallet = require("../controller/safe-wallets/get-user-safe-wallet.controller");
const getBCHBalance = require("../controller/safe-wallets/get-bch-balance.controller");
const withdrawalBCH = require("../controller/safe-wallets/withdrawal-bch.controller");
const authorize = require("../../auth/middlewares/authorize.middleware");
const router = express.Router();
const Role = require("../../auth/helpers/role.helper.js");


router.post("/safe-wallet", createSafeWallet);
router.get("/safe-wallet/users/:id", getUserSafeWallet);
router.post("/safe-wallet/balance", authorize(Role.User,Role.Admin), getBCHBalance);
router.post("/safe-wallet/withdrawal", authorize(Role.User, Role.Admin), withdrawalBCH);

module.exports = router;
