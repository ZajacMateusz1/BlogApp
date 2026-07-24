import { useQuery } from "@tanstack/react-query";

import useAuth from "../../auth/hooks/useAuth";
import { sendRequest } from "../../../utils/http/http";
import type { UserResponseType } from "../types/users-types";

import UserForm from "../components/UserForm/UserForm";
import LoadingSpinner from "../../shared/components/LoadingSpinner";
import ErrorBlock from "../../shared/components/ErrorBlock";

export default function EditUserProfilePage() {
  const { userId, token } = useAuth();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users", userId],
    queryFn: ({ signal }) =>
      sendRequest<UserResponseType>(`/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal,
      }),
    staleTime: 10000,
  });
  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorBlock>{error.message}</ErrorBlock>;
  return <UserForm userData={data} />;
}
