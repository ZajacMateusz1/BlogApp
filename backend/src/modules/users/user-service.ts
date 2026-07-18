import mongoose, { mongo } from "mongoose";
import HttpError from "../../errors/HttpError.js";
import {
  getUsersRepository,
  getUserRepository,
  editUserRepository,
  getUserPostsRepository,
  getUserPostsIsLiked,
  followUserRepository,
  unfollowUserRepository,
  updateFollowersNumber,
  updateFollowingsNumber,
  getIsFollowing,
  searchUserRepository,
  getFollowings,
  getFriendsSuggestionsRepository,
} from "./user-repository.js";
import type { EditUserSchemaType } from "./user-schema.js";

import {
  uploadToSupabase,
  removeFromSupabase,
  getpublicUrl,
  DEFAULT_AVATAR_PATH,
} from "../../utils/supabaseHelpers.js";

export const getUsersService = async () => {
  const users = await getUsersRepository();
  return users.map(({ _id, avatarPath, ...user }) => ({
    id: _id,
    avatar: getpublicUrl(avatarPath),
    ...user,
  }));
};
export const getUserService = async (
  profileUserId: string,
  loggedUserId: string,
) => {
  const user = await getUserRepository(profileUserId);
  if (user === null) throw new HttpError("User not found", 404);
  const isFollowing = await getIsFollowing(loggedUserId, profileUserId);
  const { _id, avatarPath, ...userObject } = user;
  return {
    id: _id,
    avatar: getpublicUrl(avatarPath),
    isFollowing,
    ...userObject,
  };
};

export const editUserService = async (
  userId: string,
  editUserData: EditUserSchemaType & { avatarPath?: string },
  avatarFile: Express.Multer.File | undefined,
) => {
  let newAvatarPath: string | undefined = undefined;
  const oldUserData = await getUserRepository(userId);
  if (oldUserData === null) throw new HttpError("User not found", 404);
  if (avatarFile) {
    newAvatarPath = await uploadToSupabase(avatarFile, "avatars");
    editUserData = { ...editUserData, avatarPath: newAvatarPath };
  }
  try {
    const editedUser = await editUserRepository(userId, editUserData);
    if (editedUser == null) throw new HttpError("User not found", 404);
    if (newAvatarPath && oldUserData.avatarPath !== DEFAULT_AVATAR_PATH) {
      try {
        await removeFromSupabase(oldUserData.avatarPath);
      } catch (removeError) {
        console.error(`Failed to remove old avatar, ${removeError}`);
      }
    }
    const { _id, avatarPath, ...userObject } = editedUser;
    return {
      id: _id,
      avatar: getpublicUrl(avatarPath),
      ...userObject,
    };
  } catch (error) {
    if (newAvatarPath) {
      try {
        await removeFromSupabase(newAvatarPath);
      } catch (removeError) {
        console.error(`Failed to remove new image, ${removeError}`);
      }
    }
    throw error;
  }
};

export const searchUserService = async (searchQuery: string) => {
  const usersList = await searchUserRepository(searchQuery);
  return usersList.map(({ _id, avatarPath, ...userInfo }) => ({
    id: _id,
    avatar: getpublicUrl(avatarPath),
    ...userInfo,
  }));
};

// User posts

export const getUserPostsService = async (
  userId: string,
  limit: number,
  cursor: string | undefined,
) => {
  const posts = await getUserPostsRepository(userId, limit, cursor);
  const postsIds = posts.map(({ _id }) => _id);
  const nextCursor = posts.at(-1)?._id;
  const isLiked = await getUserPostsIsLiked(userId, postsIds);
  const isLikedSet = new Set();
  isLiked.forEach(({ post }) => isLikedSet.add(post.toString()));
  return {
    posts: posts.map(({ _id, creator, imagePath, ...postData }) => {
      const id = _id.toString();
      return {
        id,
        creator: {
          id: creator._id,
          username: creator.username,
          avatar: getpublicUrl(creator.avatarPath),
        },
        isLiked: isLikedSet.has(id),
        image: getpublicUrl(imagePath),
        ...postData,
      };
    }),
    nextCursor,
  };
};

// follows

export const followUserService = async (
  followerId: string,
  followingId: string,
) => {
  if (followerId === followingId)
    throw new HttpError("You cannot follow yourself.", 400);
  const session = await mongoose.startSession();
  try {
    return await session.withTransaction(async () => {
      const { _id, __v, ...createdFollow } = (
        await followUserRepository(followerId, followingId, session)
      ).toObject();
      await Promise.all([
        updateFollowersNumber(followingId, session, 1),
        updateFollowingsNumber(followerId, session, 1),
      ]);
      return {
        ...createdFollow,
        id: _id,
      };
    });
  } finally {
    await session.endSession();
  }
};

export const unfollowUserService = async (
  followerId: string,
  followingId: string,
) => {
  const session = await mongoose.startSession();
  try {
    return await session.withTransaction(async () => {
      const deletedFollow = await unfollowUserRepository(
        followerId,
        followingId,
        session,
      );
      await Promise.all([
        updateFollowersNumber(followingId, session, -1),
        updateFollowingsNumber(followerId, session, -1),
      ]);
      return deletedFollow;
    });
  } finally {
    await session.endSession();
  }
};

// friend suggestions

export const getFriendsSuggestionsService = async (userId: string) => {
  const limit = 5;
  const followings = await getFollowings(userId);
  const suggestions = await getFriendsSuggestionsRepository(userId, followings);
  return suggestions.map(({ mutualFriends, suggestion }) => {
    const { _id, avatarPath, ...suggestionData } = suggestion;
    return {
      id: _id,
      avatar: getpublicUrl(avatarPath),
      ...suggestionData,
      mutualFriends,
    };
  });
};
