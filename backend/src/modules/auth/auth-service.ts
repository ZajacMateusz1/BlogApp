import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "../../config/env.js";
import HttpError from "../../errors/HttpError.js";
import { registerRepository, findUserByEmail } from "./auth-repository.js";
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
      username: createdUser.username,
    },
    env.JWT_SECRET,
    {
      expiresIn: "10h",
    },
  );
  return {
    id: createdUser._id,
    email: createdUser.email,
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
      username: user.username,
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
