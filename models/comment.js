const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    content: { type: String, required: true },
    author: { type: Schema.Types.Mixed, required: true },
    authorType: { type: String, required: true, enum: ["Guest", "User"] },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", CommentSchema);

const guestAuthorSchema = new Schema({
  author: { type: String, ref: "Guest" },
});

const GuestAuthorComment = Comment.discriminator(
  "GuestAuthorComment",
  guestAuthorSchema
);

const userAuthorSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User" },
});

const UserAuthorComment = Comment.discriminator(
  "UserAuthorComment",
  userAuthorSchema
);

module.exports = { Comment, GuestAuthorComment, UserAuthorComment };
