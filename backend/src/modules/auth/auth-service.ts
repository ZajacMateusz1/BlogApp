import bcrypt from "bcrypt";
import HttpError from "../../errors/HttpError";
import { registerRepository, findUserByEmail } from "./auth-repository";
export const registerService = async (
  email: string,
  password: string,
  username: string,
) => {
  password = await bcrypt.hash(password, 12);
  const userExists = await findUserByEmail(email);
  if (userExists) {
    throw new HttpError("User alredy exists", 409);
  }
  const createdUser = await registerRepository(email, password, username);
  return {
    id: createdUser._id,
    email: createdUser.email,
    username: createdUser.username,
  };
};
export const loginService = async (email: string, password: string) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new HttpError("Invalid email or password", 401);
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new HttpError("Invalid email or password", 401);
  }
  return {
    id: user._id,
    email: user.email,
  };
};
