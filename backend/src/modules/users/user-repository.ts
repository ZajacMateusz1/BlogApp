import User from "../../models/user-model.js";
import Post from "../../models/post-model.js";
import Like from "../../models/like-model.js";
import Follow from "../../models/follow-model.js";
import type { Types } from "mongoose";
import type { EditUserSchemaType } from "./user-schema.js";

import type { PopulatedPostType } from "../posts/posts-types";

export const getUsersRepository = () => {
  return User.find({}, "-password -__v -posts").lean();
};
export const getUserRepository = (userId: string) => {
  return User.findById(userId, "-__v -password -posts -email").lean();
};

export const editUserRepository = (
  userId: string,
  editUserData: EditUserSchemaType & { avatarPath?: string },
) => {
  return User.findByIdAndUpdate(userId, editUserData, {
    returnDocument: "after",
  }).lean();
};

// User posts

export const getUserPostsRepository = (
  userId: string,
  limit: number,
  cursor: string | undefined,
) => {
  const filters = cursor
    ? { creator: userId, _id: { $lt: cursor } }
    : { creator: userId };
  return Post.find(filters, "-__v")
    .populate("creator", "username avatarPath")
    .sort({ _id: -1 })
    .limit(limit)
    .lean<PopulatedPostType[]>();
};

export const getUserPostsIsLiked = (
  userId: string,
  postsIds: Types.ObjectId[],
) => {
  return Like.find({
    user: userId,
    post: { $in: postsIds },
  })
    .select("post -_id")
    .lean();
};

// follows

export const followUserRepository = async (
  followerId: string,
  followingId: string,
) => {
  const createdFollow = new Follow({
    follower: followerId,
    following: followingId,
  });
  await createdFollow.save();
  return createdFollow;
};

export const unfollowUserRepository = (
  followerId: string,
  followingId: string,
) => {
  return Follow.findOneAndDelete({
    follower: followerId,
    following: followingId,
  }).lean();
};
