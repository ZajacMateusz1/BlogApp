import HttpError from "../../errors/HttpError.js";
import {
  getUsersRepository,
  getUserRepository,
  getUserPosts,
} from "./user-repository.js";

export const getUsersService = async () => {
  const users = await getUsersRepository();
  return users.map(({ _id, ...rest }) => ({
    id: _id,
    ...rest,
  }));
};
export const getUserService = async (userId: string) => {
  const user = await getUserRepository(userId);
  if (user === null) throw new HttpError("User not found", 404);
  const posts = await getUserPosts(userId);
  const { _id, ...userObject } = user;
  return {
    id: _id,
    ...userObject,
    posts,
  };
};
