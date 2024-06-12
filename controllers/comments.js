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

const getAllComments = async (req, res) => {
  const comments = await Comment.find({})
    .populate("post")
    .sort({ createdAt: -1 });

  res.json({ comments });
};

const getComments = async (req, res) => {
  const {
    params: { id: postId },
  } = req;

  const comments = await Comment.find({
    post: postId,
  })
    .populate("author")
    .populate("replies")
    .exec();
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

    req.user = { userId: payload.userId };
    const user = await User.findOne({ _id: req.user.userId });

    comment = new UserAuthorComment({
      content,
      author: user._id,
      authorType: "User",
      post: postId,
    });
  } else {
    console.log(req.body.name);
    comment = new GuestAuthorComment({
      content,
      author: req.body.name || "Anonymous",
      authorType: "Guest",
      post: postId,
    });
  }
  await comment.save();

  post.comments.push(comment._id);
  await post.save();

  console.log(post.author);

  const author = await User.findOneAndUpdate(
    { _id: post.author },
    { $push: { activity: comment } },
    { new: true } // Optionally return the updated document
  );

  console.log(author);
  res.status(StatusCodes.CREATED).json({ comment });
};

const deleteComment = async (req, res) => {
  const commentId = req.params.id;
  const comment = await Comment.findByIdAndRemove({ _id: commentId });
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
  getAllComments,
};
