import { Schema, model, Types } from "mongoose";

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    imagePath: { type: String, required: true },
    description: { type: String },
    creator: { type: Types.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true },
);

const Post = model("Post", postSchema);
export default Post;
