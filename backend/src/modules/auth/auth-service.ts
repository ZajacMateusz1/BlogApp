import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "../../config/env";
import HttpError from "../../errors/HttpError";
import { registerRepository, findUserByEmail } from "./auth-repository";
export const registerService = async (
  email: string,
  password: string,
  username: string,
) => {
  const userExists = await findUserByEmail(email);
  if (userExists) {
    throw new HttpError("User alredy exists", 409);
  }
  password = await bcrypt.hash(password, 12);
  const createdUser = await registerRepository(email, password, username);
  const token = jwt.sign(
    {
      userId: createdUser._id,
      email: createdUser.email,
    },
    env.JWT_SECRET,
    {
      expiresIn: "10h",
    },
  );
  return {
    id: createdUser._id,
    email: createdUser.email,
    username: createdUser.username,
    token,
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
  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email,
    },
    env.JWT_SECRET,
    {
      expiresIn: "10h",
    },
  );
  return {
    id: user._id,
    email: user.email,
    token,
  };
};
