import jwt from "jsonwebtoken";
import env from "../config/env.js";
import type { TokenPayload } from "../types/token/jwt-payload-type";

export const verifyToken = (token: string) => {
  return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
};
