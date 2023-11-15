const express = require("express");
const addMarketListing = require("../controller/add-market-listings.controller");
const marketListingByCard = require("../controller/get-market-listings-by-card.controller");
const removeMarketListing = require("../controller/remove-market-listings.controller");
const router = express.Router();

router.post("/", addMarketListing);
router.post("/card", marketListingByCard);
router.post("/:id", removeMarketListing);

module.exports = router;
