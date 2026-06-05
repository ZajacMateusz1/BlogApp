import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { sendRequest } from "../../../utils/http";
import type { UserResponseType } from "../types/users-types";

import LoadingSpinner from "../../shared/components/LoadingSpinner";
import ErrorBlock from "../../shared/components/ErrorBlock";
import UserProfile from "../components/UserProfile";
import UserPosts from "../components/UserPosts";

export default function UserDetailsPage() {
  const { userId } = useParams();
  const {
    data: userData,
    isLoading: userIsLoading,
    isError: userIsError,
    error: useError,
  } = useQuery({
    queryKey: ["users", userId],
    queryFn: ({ signal }) =>
      sendRequest<UserResponseType>(`/api/users/${userId}`, { signal }),
    staleTime: 10000,
  });
  if (userIsLoading) return <LoadingSpinner />;
  if (userIsError) return <ErrorBlock>{useError.message}</ErrorBlock>;
  return (
    <>
      <UserProfile userData={userData} />
      <UserPosts />
    </>
  );
}
