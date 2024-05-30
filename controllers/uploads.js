const { StatusCodes } = require("http-status-codes");

const uploadPostImage = async (req, res) => {
  console.log(req.files);
  res.send("upload post image");
};

module.exports = { uploadPostImage };
