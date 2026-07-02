import { Schema, model, Types } from "mongoose";

const likeSchema = new Schema(
  {
    user: { type: Types.ObjectId, required: true, ref: "User" },
    post: { type: Types.ObjectId, required: true, ref: "Post" },
  },
  { timestamps: true },
);

likeSchema.index({ user: 1, post: 1 }, { unique: true });

const Like = model("Like", likeSchema);
export default Like;
