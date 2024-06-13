const { BadRequestError } = require("../errors");
const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");

//get user
const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ _id: id })
      .select("-password")
      .populate({
        path: "activity",
        options: {
          sort: { createdAt: -1 },
        },
        populate: [
          {
            path: "post",
            model: "Post",
          },
        ],
      });

    if (!user) throw new BadRequestError(`No user with id ${id} found`);
    res.status(StatusCodes.OK).json({ data: user });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

//get users
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password").exec();
    res.status(StatusCodes.OK).json({ data: users });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

const editUser = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.user.userId },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    res.status(StatusCodes.OK).json({
      user: {
        name: user.name,
        id: user._id,
        bio: user.bio,
        image: user.image,
      },
    });
  } catch (error) {
    res.status(404).json(error);
  }
};

module.exports = { getUser, getUsers, editUser };
