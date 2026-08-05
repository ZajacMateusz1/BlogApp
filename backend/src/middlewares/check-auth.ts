import type { Request, Response, NextFunction } from "express";

import { verifyToken } from "../utils/verify-token.js";
import HttpError from "../errors/HttpError.js";

const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new Error();
    }
    const decodedToken = verifyToken(token);
    req.userData = {
      userId: decodedToken.userId,
      username: decodedToken.username,
    };
    next();
  } catch {
    next(new HttpError("Authentication failed!", 401));
  }
};
export default checkAuth;
