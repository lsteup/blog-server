const User = require("../models/user");

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
  res.send("edit user");
};

module.exports = { getUser, getUsers, editUser };
