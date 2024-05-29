const User = require("../models/user");
const Post = require("../models/post");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
require("jsonwebtoken");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({
    user: { name: user.name, token, posts: user.posts, id: user._id },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const posts = await Post.find({ author: user.id }).sort("createdAt");
  user.posts = posts;

  const token = user.createJWT();
  res
    .status(StatusCodes.OK)
    .json({
      user: { name: user.name, token, posts: user.posts, id: user._id },
    });
};

module.exports = {
  register,
  login,
};
