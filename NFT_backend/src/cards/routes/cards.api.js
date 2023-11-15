const express = require("express");
const createRarity = require("../controllers/card-rarity/create-rarity.controller");
const deleteRarity = require("../controllers/card-rarity/delete-rarity.controller");
const getCardsByrarity = require("../controllers/card-rarity/get-cards-by-rarity.controller");
const getRarities = require("../controllers/card-rarity/get-rarities.controller");
const getRarity = require("../controllers/card-rarity/get-rarity.controller");
const updateRarity = require("../controllers/card-rarity/update-rarity.controller");
const createCardType = require("../controllers/card-types/create-card-type.controller");
const deleteCardType = require("../controllers/card-types/delete-card-type.controller");
const getCardType = require("../controllers/card-types/get-card-type.controller");
const getCardTypes = require("../controllers/card-types/get-card-types.controller");
const updateCardType = require("../controllers/card-types/update-card-type.controller");
const createCard = require("../controllers/create-card.controller");
const deleteCard = require("../controllers/delete-card.controller");
const getCard = require("../controllers/get-card.controller");
const getCards = require("../controllers/get-cards.controller");
const getUserCards = require("../controllers/get-user-cards.controller");
const updateCard = require("../controllers/update-card.controller");
const generateCardsController = require("../controllers/generate-cards.controller");
const authorize = require("../../auth/middlewares/authorize.middleware");
const Role = require("../../auth/helpers/role.helper.js");
const cardPurchasedController = require("../controllers/cards-purchased.controller");
const getUserCardsbyCard = require("../controllers/get-user-cards-by-card.controller");

const transferCard = require('../controllers/transfer-card.controller');
const sellCard = require('../controllers/sell-card.controller');
const cardImgResizer = require('../controllers/card-image-resizer.controller');
const router = express.Router();

// rariites
router.post("/rarity", authorize(Role.User, Role.Admin), createRarity);
router.delete("/rarity/:id", authorize(Role.User, Role.Admin), deleteRarity);
router.get("/rarity", authorize(Role.User, Role.Admin), getRarities);
router.get("/rarity/:id", authorize(Role.User, Role.Admin), getRarity);
router.get(
  "/rarity/:id/cards",
  authorize(Role.User, Role.Admin),
  getCardsByrarity
);
router.patch("/rarity/:id", authorize(Role.User, Role.Admin), updateRarity);

// card types
router.post("/type", authorize(Role.User, Role.Admin), createCardType);
router.delete("/type/:id", authorize(Role.User, Role.Admin), deleteCardType);
router.get("/type/:id", authorize(Role.User, Role.Admin), getCardType);
router.get("/type", authorize(Role.User, Role.Admin), getCardTypes);
router.patch("/type/:id", authorize(Role.User, Role.Admin), updateCardType);

// cards
router.post("/", authorize(Role.User, Role.Admin), createCard);
router.post(
  "/generate",
  // authorize(Role.User, Role.Admin),
  generateCardsController
);

router.get(
  "/img",
  cardImgResizer
);

router.delete("/:id", authorize(Role.User, Role.Admin), deleteCard);
router.get("/:id", getCard);
router.get("/", getCards);

router.get(
  "/user-cards",
  // authorize(Role.User, Role.Admin),
  getUserCards
);

router.patch(
  "/:id",
  // authorize(Role.User, Role.Admin),
  updateCard
);

router.post(
  "/purchased",
  // authorize(Role.User, Role.Admin),
  cardPurchasedController
);

router.post(
  "/card",
  // authorize(Role.User, Role.Admin),
  getUserCardsbyCard
);

router.post(
	"/transfer",
	transferCard.transferCardHandler
);

router.post(
	"/sell",authorize(Role.User, Role.Admin),
	sellCard.sellCardHandler
);

module.exports = router;
