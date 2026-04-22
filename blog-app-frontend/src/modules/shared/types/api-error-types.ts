type ResponseErrorDetails = {
  formErrors: string[];
  fieldErrors: Record<string, string[]>;
};
export type APIErrorType = {
  message: string;
  details: ResponseErrorDetails | null;
};
