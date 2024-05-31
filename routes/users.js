const express = require("express");
const router = express.Router();

const { getUser, getUsers } = require("../controllers/user");

router.route("/:id").get(getUser);
router.route("/").get(getUsers);

module.exports = router;
