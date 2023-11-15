const express = require("express");
const createTransaction = require("../controllers/create-transaction.controller");
const getTransaction = require("../controllers/get-transaction.controller");
const getTransactions = require("../controllers/get-transactions.controller");
const getUserTransactions = require("../controllers/get-user-transactions.controller");
const authorize = require("../../auth/middlewares/authorize.middleware");
const Role = require("../../auth/helpers/role.helper");
const router = express.Router();

router.post(
  "/",
  // authorize(Role.User, Role.Admin),
  createTransaction
);
router.get(
  "/:id",
  // authorize(Role.User, Role.Admin),
  getTransaction
);
router.get(
  "/",
  // authorize(Role.User, Role.Admin),
  getTransactions
);

router.get(
  "/users/:id",
  // authorize(Role.User, Role.Admin),
  getUserTransactions
);

module.exports = router;
