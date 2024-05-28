const Post = require("../models/post");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getDrafts = async (req, res) => {
  const posts = await Post.find({
    published: false,
    author: req.user.userId,
  }).sort("createdAt");
  res.status(StatusCodes.OK).json({ posts, count: posts.length });
};

const getDraft = async (req, res) => {
  const {
    user: { userId },
    params: { id: postId },
  } = req;

  const post = await Post.findOne({
    _id: postId,
    author: userId,
  })
    .populate("author")
    .exec();

  if (!post) {
    throw new NotFoundError(`No post with id ${postId}`);
  }
  res.status(StatusCodes.OK).json({ post });
};

const getPosts = async (req, res) => {
  const posts = await Post.find({ published: true }).sort("createdAt");
  res.status(StatusCodes.OK).json({ posts, count: posts.length });
};
const getPost = async (req, res) => {
  const {
    params: { id: postId },
  } = req;

  const post = await Post.findOne({
    published: true,
    _id: postId,
  })
    .populate("author")
    .exec();

  if (!post) {
    throw new NotFoundError(`No post with id ${postId}`);
  }
  res.status(StatusCodes.OK).json({ post });
};

const createPost = async (req, res) => {
  req.body.author = req.user.userId;
  const post = await Post.create(req.body);
  res.status(StatusCodes.CREATED).json({ post });
};

const updatePost = async (req, res) => {
  const {
    body: { published, content, title },
    user: { userId },
    params: { id: postId },
  } = req;

  if (content === "" || title === "" || published === "") {
    throw new BadRequestError("Content or Title or Published cannot be empty");
  }

  const post = await Post.findOneAndUpdate(
    {
      _id: postId,
      author: userId,
    },
    req.body,
    { new: true, runValidators: true }
  );

  if (!post) {
    throw new NotFoundError(`No post with id ${postId}`);
  }
  res.status(StatusCodes.OK).json({ post });
};

const deletePost = async (req, res) => {
  const {
    user: { userId },
    params: { id: postId },
  } = req;

  const post = await Post.findByIdAndRemove({
    _id: postId,
    author: userId,
  });

  if (!post) {
    throw new NotFoundError(`No post with id ${postId}`);
  }
  res.status(StatusCodes.OK).send();
};

module.exports = {
  getDrafts,
  getDraft,
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
};
