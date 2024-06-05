const express = require("express");
const router = express.Router();

const { getAllComments } = require("../controllers/comments");

router.route("/").get(getAllComments);

module.exports = router;
