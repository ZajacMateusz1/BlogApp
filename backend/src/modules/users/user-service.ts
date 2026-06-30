import HttpError from "../../errors/HttpError.js";
import {
  getUsersRepository,
  getUserRepository,
  editUserRepository,
  getUserPostsRepository,
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
export const getUserService = async (userId: string) => {
  const user = await getUserRepository(userId);
  if (user === null) throw new HttpError("User not found", 404);
  const { _id, avatarPath, ...userObject } = user;
  return {
    id: _id,
    avatar: getpublicUrl(avatarPath),
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

export const getUserPostsService = async (
  userId: string,
  limit: number,
  cursor: string | undefined,
) => {
  const posts = await getUserPostsRepository(userId, limit, cursor);
  const nextCursor = posts.at(-1)?._id;
  return {
    posts: posts.map(({ _id, creator, ...postData }) => ({
      id: _id,
      creator: {
        id: creator._id,
        username: creator.username,
        avatar: getpublicUrl(creator.avatarPath),
      },
      ...postData,
    })),
    nextCursor,
  };
};
