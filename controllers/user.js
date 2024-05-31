const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");

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

    res.json({ data: user });
  } catch (error) {
    res.json(error);
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password").exec();
    res.json({ data: users });
  } catch (err) {
    res.json(err);
  }
};

const editUser = async (req, res) => {
  console.log(req.body);
  console.log(req.user.userId);

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
    res.json(error);
  }
};

module.exports = { getUser, getUsers, editUser };
