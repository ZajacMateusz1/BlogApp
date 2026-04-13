import HttpError from "../errors/HttpError";
import { z } from "zod";

const mapToHTTPError = (error: unknown) => {
  if (error instanceof HttpError) {
    return error;
  }
  if (error instanceof z.ZodError) {
    const flattened = z.flattenError(error);
    return new HttpError("Validation Error", 422, flattened);
  }
  return new HttpError("Internal Server Error", 500);
};
export default mapToHTTPError;
