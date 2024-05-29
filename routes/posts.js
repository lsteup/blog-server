const express = require("express");
const router = express.Router();

const {
  createPost,
  getPost,
  getPosts,
  updatePost,
  deletePost,
  getActivity,
} = require("../controllers/posts");

const authMiddleware = require("../middleware/authentication");

const {
  getComments,
  getComment,
  deleteComment,
  createComment,
  createReply,
} = require("../controllers/comments");

router.route("/activity").get(authMiddleware, getActivity);

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
  .post(authMiddleware, createReply)
  .delete(authMiddleware, deleteComment);

module.exports = router;
