const express = require("express");
const createPaymentSession = require("../controllers/create-payment-session.controller");
const paymentSession = require("../controllers/payment-session.controller");
const authorize = require("../../auth/middlewares/authorize.middleware");
const Role = require("../../auth/helpers/role.helper");
const cryptoPaymentTransactionController = require("../controllers/crypto-payment-transaction.controller");
const coinpaymentsIPNController = require("../controllers/coinpaymentsIPN.controller");
const router = express.Router();

router.post("/stripe/create-payment-session", createPaymentSession);

router.get("/stripe/payment-session", paymentSession);

router.post(
  "/crypto/create-payment-session",
  cryptoPaymentTransactionController
);

router.post("/crypto/ipn",coinpaymentsIPNController);

module.exports = router;
