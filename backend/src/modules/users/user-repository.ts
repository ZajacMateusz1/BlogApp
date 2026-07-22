import User from "../../models/user-model.js";
import Post from "../../models/post-model.js";
import Like from "../../models/like-model.js";
import Follow from "../../models/follow-model.js";
import { Types } from "mongoose";
import type { ClientSession } from "mongoose";
import type { EditUserSchemaType } from "./user-schema.js";

import type { PopulatedPostType } from "../posts/posts-types";
import type { SuggestionType } from "./user-types.js";

export const getUsersRepository = () => {
  return User.find({}, "-password -__v").lean();
};
export const getUserRepository = (userId: string) => {
  return User.findById(userId, "-__v -password -email").lean();
};
export const getIsFollowing = async (
  followerId: string,
  followingId: string,
) => {
  return Boolean(
    await Follow.exists({ follower: followerId, following: followingId }),
  );
};

export const editUserRepository = (
  userId: string,
  editUserData: EditUserSchemaType & { avatarPath?: string },
) => {
  return User.findByIdAndUpdate(userId, editUserData, {
    returnDocument: "after",
  }).lean();
};

export const searchUserRepository = (searchQuery: string) => {
  const escepedQuery = RegExp.escape(searchQuery);
  return User.find({ username: { $regex: escepedQuery, $options: "i" } })
    .select("username avatarPath")
    .limit(5)
    .lean();
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
  session: ClientSession,
) => {
  const createdFollow = new Follow({
    follower: followerId,
    following: followingId,
  });
  await createdFollow.save({ session });
  return createdFollow;
};

export const unfollowUserRepository = (
  followerId: string,
  followingId: string,
  session: ClientSession,
) => {
  return Follow.findOneAndDelete(
    {
      follower: followerId,
      following: followingId,
    },
    { session },
  ).lean();
};

export const updateFollowersNumber = (
  userId: string,
  session: ClientSession,
  value: -1 | 1,
) => {
  return User.updateOne(
    {
      _id: userId,
    },
    { $inc: { followersCount: value } },
    { session },
  );
};

export const updateFollowingsNumber = (
  userId: string,
  session: ClientSession,
  value: -1 | 1,
) => {
  return User.updateOne(
    {
      _id: userId,
    },
    { $inc: { followingsCount: value } },
    { session },
  );
};

// friend suggestions

export const getFollowings = async (userId: string) => {
  const followings = await Follow.find({ follower: userId })
    .select("following -_id")
    .lean();
  return followings.map(({ following }) => following);
};

export const getFriendsSuggestionsRepository = async (
  userId: string,
  followings: Types.ObjectId[],
) => {
  return Follow.aggregate<SuggestionType>([
    {
      $match: {
        follower: { $in: followings },
        following: { $nin: [new Types.ObjectId(userId), ...followings] },
      },
    },
    {
      $group: { _id: "$following", mutualFollowings: { $sum: 1 } },
    },
    { $sort: { mutualFriends: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "suggestion",
      },
    },
    {
      $unwind: "$suggestion",
    },
    {
      $project: {
        mutualFollowings: 1,
        suggestion: {
          _id: 1,
          username: 1,
          avatarPath: 1,
        },
      },
    },
  ]);
};

export const getPopularUsersSuggestions = (
  userId: string,
  followings: Types.ObjectId[],
  responseIds: Types.ObjectId[],
  limit: number,
) => {
  return User.find({
    _id: { $nin: [new Types.ObjectId(userId), ...followings, ...responseIds] },
  })
    .select("username avatarPath")
    .sort({ followersCount: -1 })
    .limit(limit)
    .lean();
};
