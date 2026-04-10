import type { Request, Response, NextFunction } from "express";
import mapToHTTPError from "../utils/error-map.js";
const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (res.headersSent) {
    return next(error);
  }
  console.error(error);
  const mappedError = mapToHTTPError(error);
  res.status(mappedError.statusCode).json({ message: mappedError.message });
};
export default errorHandler;
