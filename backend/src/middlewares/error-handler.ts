import type { Request, Response, NextFunction } from "express";
// import env from "../config/env.js";
import mapToHTTPError from "../utils/error-map.js";
// import { ZodError } from "zod";

const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (res.headersSent) {
    return next(error);
  }

  // if (error instanceof Error && !(error instanceof ZodError)) {
  //   fetch(`${env.BUG_ANALYZER_API_URL}/api/bugs/analyze`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${env.BUG_ANALYZER_KEY}`,
  //     },
  //     body: JSON.stringify({
  //       service: "social-media-app",
  //       method: req.method,
  //       path: req.path,
  //       name: error.name,
  //       message: error.message,
  //       stack: error.stack,
  //     }),
  //   });
  // }

  console.error(error);
  const mappedError = mapToHTTPError(error);
  res
    .status(mappedError.statusCode)
    .json({ message: mappedError.message, details: mappedError.details });
};
export default errorHandler;
