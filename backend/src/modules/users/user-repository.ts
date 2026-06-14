import User from "../../models/user-model.js";
import type { EditUserSchemaType } from "./user-schema.js";

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
