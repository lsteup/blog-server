const express = require("express");
const router = express.Router();

const {
  createPost,
  getPost,
  getPosts,
  updatePost,
  deletePost,
} = require("../controllers/posts");

const authMiddleware = require("../middleware/authentication");

const {
  getComments,
  getComment,
  deleteComment,
  createComment,
} = require("../controllers/comments");

router.route("/").post(authMiddleware, createPost).get(getPosts);
router
  .route("/:id")
  .get(getPost)
  .delete(authMiddleware, deletePost)
  .patch(authMiddleware, updatePost);
router.route("/:id/comments").post(createComment).get(getComments);
router
  .route("/:id/comments/:id")
  .get(getComment)
  .delete(authMiddleware, deleteComment);

module.exports = router;
