import { Schema, model, Types } from "mongoose";

const commentSchema = new Schema(
  {
    post: { type: Types.ObjectId, required: true, ref: "Post" },
    author: { type: Types.ObjectId, required: true, ref: "User" },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Comment = model("Comment", commentSchema);
export default Comment;
