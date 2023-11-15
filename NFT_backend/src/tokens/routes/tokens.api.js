const express = require("express");
// TODO: Is these methods are in use ?? cannot find reference to them from frontend..
// const createNFT = require("../controllers/child-tokens/create-nft.controller");
// const getNFTs = require("../controllers/child-tokens/get-nfts.controller");
// const getUsersNFTs = require("../controllers/child-tokens/users-nft.controller");
const createGroupToken = require("../controllers/group-tokens/create-group-token.controller");
const deleteGroupToken = require("../controllers/group-tokens/delete-group-token.controller");
const getGroupToken = require("../controllers/group-tokens/get-group-token.controller");
const getGroupTokens = require("../controllers/group-tokens/get-group-tokens.controller");
const authorize = require("../../auth/middlewares/authorize.middleware");
const Role = require("../../auth/helpers/role.helper");
const updateGroupTokens = require("../controllers/group-tokens/update-group-token.controller");
const router = express.Router();

// TODO: Is these methods are in use ?? cannot find reference to them from frontend..
// child tokens
//router.post("/nft-tokens", authorize(Role.User, Role.Admin), createNFT);
//router.get("/nft-tokens", authorize(Role.User, Role.Admin), getNFTs);
//router.get(
//  "/nft-tokens/users/:id",
//  authorize(Role.User, Role.Admin),
//  getUsersNFTs
// );

// group tokens
router.post(
  "/group-tokens",
  authorize(Role.User, Role.Admin),
  createGroupToken
);
router.delete(
  "/group-tokens/:id",
  authorize(Role.User, Role.Admin),
  deleteGroupToken
);
router.get("/group-tokens", authorize(Role.User, Role.Admin), getGroupToken);
router.get(
  "/group-tokens/:id",
  authorize(Role.User, Role.Admin),
  getGroupTokens
);
router.patch(
  "/group-tokens/:id",
  authorize(Role.User, Role.Admin),
  updateGroupTokens
);

module.exports = router;
