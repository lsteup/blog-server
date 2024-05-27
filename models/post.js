const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    title: { type: String, required: true, maxLength: 200 },
    author: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    comments: {
      type: [{ type: mongoose.Types.ObjectId, ref: "Comment" }],
      default: [],
    },
    content: {
      type: String,
      required: true, //minLength: 200
    },
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
