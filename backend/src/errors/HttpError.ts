type ValidationErrors = {
  formErrors: string[];
  fieldErrors: Record<string, string[]>;
};
class HttpError extends Error {
  public statusCode: number;
  public details: ValidationErrors | null;
  constructor(
    message: string,
    statusCode: number,
    details: ValidationErrors | null = null,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}
export default HttpError;
