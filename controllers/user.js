const User = require("../models/user");

const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ _id: id }).populate("activity").exec();
    res.json({ data: user });
  } catch (error) {
    res.json(error);
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json({ data: users });
  } catch (err) {
    res.json(err);
  }
};

module.exports = { getUser, getUsers };
