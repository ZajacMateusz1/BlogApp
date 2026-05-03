import { QueryClient } from "@tanstack/react-query";
export const queryClient = new QueryClient();

import type { APIErrorType } from "../modules/shared/types/api-error-types";
export async function sendRequest<T>(
  url: string,
  options: RequestInit,
): Promise<T> {
  const response = await fetch(url, options);
  if (!response.ok) {
    const error: APIErrorType = await response.json();
    if (error.details) {
      console.error(error.details);
    }
    throw new Error(error.message || "Something went wrong!");
  }
  const data: T = await response.json();
  return data;
}
