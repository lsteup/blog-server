const {
  Comment,
  UserAuthorComment,
  GuestAuthorComment,
} = require("../models/comment.js");
const Post = require("../models/post");
const User = require("../models/user.js");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const jwt = require("jsonwebtoken");

const getComments = async (req, res) => {
  const {
    params: { id: postId },
  } = req;

  const comments = await Comment.find({
    post: postId,
  })
    .populate("author")
    .exec();
  console.log(`comment ${comments}`);
  if (!comments) {
    throw new NotFoundError(`No post with post id ${postId}`);
  }

  res.status(StatusCodes.OK).json({ comments: comments });
};

const getComment = async (req, res) => {
  res.send("get comment");
};

const createComment = async (req, res) => {
  const authHeader = req.headers.authorization;
  const { content } = req.body;
  const postId = req.params.id;
  console.log(postId);
  let comment;

  const post = await Post.findOne({
    published: true,
    _id: postId,
  });
  if (!post) {
    throw new NotFoundError(`No post with id ${postId}`);
  }

  if (authHeader && authHeader.startsWith("Bearer")) {
    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log(payload);

    req.user = { userId: payload.userId };
    const user = await User.findOne({ _id: req.user.userId });
    console.log(user);
    comment = new UserAuthorComment({
      content,
      author: user,
      authorType: "User",
      post: postId,
    });
  } else {
    comment = new GuestAuthorComment({
      content,
      author: req.body.name,
      authorType: "Guest",
      post: postId,
    });
  }
  await comment.save();
  post.comments.push(comment._id);
  await post.save();
  res.status(StatusCodes.CREATED).json({ comment });
};

const deleteComment = async (req, res) => {
  const commentId = req.params.id;
  const comment = await Comment.findByIdAndRemove({ _id: commentId });
  console.log(comment);
  if (!comment) {
    console.log("error");
    throw new NotFoundError(`No comment with id ${commentId}`);
  }
  res.status(StatusCodes.OK).send();
};

const createReply = async (req, res) => {
  const commentId = req.params.id;
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  const content = req.body.content;

  const userId = payload.userId;
  const user = await User.findById({ _id: userId });
  const replyObject = { content, author: user, authorType: "User" };
  const reply = await Comment.create(replyObject);
  const comment = await Comment.findOne({ _id: commentId });
  comment.replies.push(reply);
  const updatedComment = await comment.save();
  res.status(StatusCodes.OK).json({ updatedComment });
};

module.exports = {
  getComments,
  getComment,
  createComment,
  deleteComment,
  createReply,
};
