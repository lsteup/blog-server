const User = require("../models/user");
const Post = require("../models/post");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  if (req.body.code !== "MEMBERCODE27956") {
    throw new UnauthenticatedError("Invalid Membership Code");
  }

  try {
    const user = await User.create({ ...req.body });
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({
      user: {
        name: user.name,
        token,
        id: user._id,
        bio: user.bio,
        image: user.image,
      },
    });
  } catch (error) {
    if (error.message.startsWith("E11000 duplicate key error")) {
      throw new BadRequestError("An account with this email already exists.");
    }
    res.status(404).json({ error: error.message });
  }
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

  res.status(StatusCodes.OK).json({
    user: {
      name: user.name,
      token,
      id: user._id,
      bio: user.bio,
      image: user.image,
      posts,
    },
  });
};

module.exports = {
  register,
  login,
};
