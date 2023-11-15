const express = require("express");
const createUser = require("../controllers/create-user.controller");
const deleteUser = require("../controllers/delete-user.controller");
const getUser = require("../controllers/get-user.controller");
const getUsers = require("../controllers/get-users.controller");
const updateUser = require("../controllers/update-users.controller");
const authorize = require("../../auth/middlewares/authorize.middleware");
const Role = require("../../auth/helpers/role.helper");
const router = express.Router();

router.post(
  "/",
  // authorize( Role.Admin),
  createUser
);
router.delete(
  "/:id",
  // authorize(Role.Admin),
  deleteUser
);
router.get(
  "/",
  // authorize(Role.Admin),
  getUsers
);
router.get(
  "/:id",
  // authorize(Role.Admin),
  getUser
);
router.patch(
  "/:id",
  // authorize(Role.Admin),

  updateUser
);

module.exports = router;
