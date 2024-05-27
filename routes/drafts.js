const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authentication");

const { getDrafts, getDraft } = require("../controllers/posts");

router.route("/").get(authMiddleware, getDrafts);
router.route("/:id").get(authMiddleware, getDraft);

module.exports = router;
