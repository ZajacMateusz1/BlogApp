import type { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import env from "../config/env";

import HttpError from "../errors/HttpError";

interface TokenPayload extends JwtPayload {
  userId: string;
  email: string;
}
const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new Error();
    }
    const decodedToken = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    req.userData = { userId: decodedToken.userId, email: decodedToken.email };
    next();
  } catch {
    next(new HttpError("Authentication failed!", 401));
  }
};
export default checkAuth;
