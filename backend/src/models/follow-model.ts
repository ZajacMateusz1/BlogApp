import { Schema, model, Types } from "mongoose";

const FollowSchema = new Schema(
  {
    follower: { type: Types.ObjectId, required: true, ref: "User" },
    following: { type: Types.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true },
);

FollowSchema.index({ follower: 1, following: 1 }, { unique: true });

const Follow = model("Follow", FollowSchema);

export default Follow;
