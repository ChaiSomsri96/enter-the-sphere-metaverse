const express = require("express");
const createBundle = require("../controllers/create-bundle.controller");
const rewardBundle = require("../controllers/reward-bundle.controller");
const getBundle = require("../controllers/get-bundle.controller");
const getBundles = require("../controllers/get-bundles.controller");
const getCardsinBundle = require("../controllers/get-cards-in-bundle.controller");
const getUserBundles = require("../controllers/get-user-bundles.controller");
const getPurchase = require("../controllers/purchases/get-purchase.controller");
const getPurchases = require("../controllers/purchases/get-purchases.controller");
const getUserPurcahes = require("../controllers/purchases/get-users-purchases.controller");
const openBundle = require("../controllers/open-bundle.controller");
const authorize = require("../../auth/middlewares/authorize.middleware");
const authorizeAPI = require("../../auth/middlewares/authorizeapi.middleware");
const Role = require("../../auth/helpers/role.helper");
const router = express.Router();

// bundle purchases
router.get("/purchases/:uuid", authorize(Role.User, Role.Admin), getPurchase);
router.get("/purchases", authorize(Role.User, Role.Admin), getPurchases);
router.get(
  "/purchases/users/:uuid",
  authorize(Role.User, Role.Admin),
  getUserPurcahes
);

// reward bundles
router.post("/reward", authorizeAPI(), rewardBundle);

// create bundle
router.post("/", authorize(Role.User, Role.Admin), createBundle);
router.get("/", authorize(Role.User, Role.Admin), getBundles);
router.get("/:id", authorize(Role.User, Role.Admin), getBundle);
router.get("/:id/open", authorize(Role.User, Role.Admin), openBundle);

router.get("/:id/cards", getCardsinBundle);
router.get("/users/:id", getUserBundles);

// open bundle
router.post(
  "/:id/open",
  //  authorize(Role.User, Role.Admin),
  openBundle
);

module.exports = router;
