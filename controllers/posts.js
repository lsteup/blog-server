const Post = require("../models/post");
const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

//get drafts
const getDrafts = async (req, res) => {
  const posts = await Post.find({
    author: req.user.userId,
  }).sort({ createdAt: -1 });
  res.status(StatusCodes.OK).json({ posts, count: posts.length });
};

//get draft
const getDraft = async (req, res) => {
  const {
    user: { userId },
    params: { id: postId },
  } = req;

  const post = await Post.findOne({
    _id: postId,
    author: userId,
  })
    .populate({
      path: "author",
      select: "-password",
    })
    .populate({
      path: "comments",
      options: {
        sort: { createdAt: -1 },
      },
    })
    .exec();

  if (!post) {
    throw new NotFoundError(`No post with id ${postId}`);
  }
  res.status(StatusCodes.OK).json({ post });
};

//get posts
const getPosts = async (req, res) => {
  const { author, title } = req.query;
  const query = { published: true };

  if (author) query.author = author;
  if (title) {
    query.title = { $regex: title, $options: "i" };
  }

  const posts = await Post.find(query)
    .populate({
      path: "author",
      select: "-password",
    })
    .sort({ createdAt: -1 })
    .exec();
  res.status(StatusCodes.OK).json({ posts, count: posts.length });
};

//get post
const getPost = async (req, res) => {
  const {
    params: { id: postId },
  } = req;

  const post = await Post.findOne({
    published: true,
    _id: postId,
  })
    .populate({
      path: "author",
      select: "-password",
    })
    .populate({
      path: "comments",
      options: {
        sort: { createdAt: -1 },
      },
    })
    .exec();

  if (!post) {
    throw new NotFoundError(`No post with id ${postId}`);
  }
  res.status(StatusCodes.OK).json({ post });
};

//create post
const createPost = async (req, res) => {
  req.body.author = req.user.userId;
  if (req.body.title.length > 200)
    throw new BadRequestError(
      "Please choose a shorter title (under 200 characters)"
    );

  if (!req.body.title)
    throw new BadRequestError("Your post must have a title.");
  if (!req.body.content)
    throw new BadRequestError("Your post must have content.");
  const post = await Post.create(req.body);
  res.status(StatusCodes.CREATED).json({ post });
};

//update post
const updatePost = async (req, res) => {
  const {
    user: { userId },
    params: { id: postId },
  } = req;

  const post = await Post.findOneAndUpdate(
    { _id: postId, author: userId },
    { $set: req.body },
    { new: true, runValidators: true }
  );

  if (!post) {
    throw new NotFoundError(`No post with id ${postId}`);
  }
  res.status(StatusCodes.OK).json({ post });
};

//delete post
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

//get activity
const getActivity = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId }).populate({
    path: "activity",
    options: {
      sort: { createdAt: -1 },
    },
    populate: {
      path: "post",
      select: "title",
    },
  });
  res.status(StatusCodes.OK).send({ activity: user.activity });
};

module.exports = {
  getDrafts,
  getDraft,
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  getActivity,
};
