import User from "../../models/user-model.js";
import Post from "../../models/post-model.js";
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

export const getUserPostsRepository = (
  userId: string,
  limit: number,
  cursor: string | undefined,
) => {
  const filters = cursor
    ? { creator: userId, _id: { $lt: cursor } }
    : { creator: userId };
  return Post.find(filters, "-__v -creator")
    .populate("creator", "username avatarPath")
    .sort({ _id: -1 })
    .limit(limit)
    .lean<PopulatedPostType[]>();
};
