const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authentication");

const { getUser, getUsers, editUser } = require("../controllers/user");

router.route("/:id").get(getUser);
router.route("/").get(getUsers);
router.route("/profile/edit").patch(authMiddleware, editUser);

module.exports = router;
