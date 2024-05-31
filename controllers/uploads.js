const { StatusCodes } = require("http-status-codes");
const path = require("path");
const { BadRequestError } = require("../errors/index");

const uploadPostImage = async (req, res) => {
  if (!req.files) {
    throw new BadRequestError("No file uploaded");
  }
  console.log(req.files.image);
  const postImg = req.files.image;
  console.log(postImg);

  if (!postImg.mimetype.startsWith("image")) {
    throw new BadRequestError("Please upload image");
  }

  const maxSize = 1024 * 1024;

  if (postImg.size.maxSize) {
    throw new BadRequestError("Please upload image smaller than 1MB");
  }

  const imagePath = path.join(
    __dirname,
    "../public/uploads/" + `${postImg.name}`
  );

  console.log(imagePath);
  try {
    await postImg.mv(imagePath);
    res
      .status(StatusCodes.OK)
      .json({ image: { src: `/uploads/${postImg.name}` } });
  } catch (error) {
    res.json({ msg: error });
  }
};

module.exports = { uploadPostImage };
