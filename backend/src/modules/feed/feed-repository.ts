import { Types } from "mongoose";
import Post from "../../models/post-model.js";

import type { PopulatedPostType } from "../posts/posts-types.js";

export const getFollwingFeedRepository = (
  cursor: string | undefined,
  limit: number,
  followings: Types.ObjectId[],
) => {
  const filters = cursor
    ? { creator: { $in: followings }, _id: { $lt: cursor } }
    : { creator: { $in: followings } };
  return Post.find(filters)
    .sort({ _id: -1 })
    .limit(limit)
    .select("-__v")
    .populate("creator", "username avatarPath")
    .lean<PopulatedPostType[]>();
};

export const getGlobalFeedRepository = (
  cursor: string | undefined,
  limit: number,
  followings: Types.ObjectId[],
) => {
  const filters = cursor
    ? { creator: { $nin: followings }, _id: { $lt: cursor } }
    : { creator: { $nin: followings } };
  return Post.find(filters)
    .sort({ _id: -1 })
    .limit(limit)
    .select("-__v")
    .populate("creator", "username avatarPath")
    .lean<PopulatedPostType[]>();
};
