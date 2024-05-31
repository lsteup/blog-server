const User = require("../models/user");

const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ _id: id });
    console.log(user);
  } catch (error) {
    res.json(error);
  }
  res.send("get user");
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    console.log(users);
  } catch (err) {
    res.json(err);
  }

  res.send("get users");
};

module.exports = { getUser, getUsers };
