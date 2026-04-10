import HttpError from "../errors/HttpError.js";

const mapToHTTPError = (error: unknown) => {
  if (error instanceof HttpError) {
    return error;
  }
  if (error instanceof Error) {
    return new HttpError(error.message, 500);
  }
  return new HttpError("Internal Server Error", 500);
};
export default mapToHTTPError;
