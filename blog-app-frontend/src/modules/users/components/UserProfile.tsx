import { useQuery } from "@tanstack/react-query";

import { sendRequest } from "../../../utils/http/http";
import type { UserResponseType } from "../types/users-types";

import LoadingSpinner from "../../shared/components/LoadingSpinner";
import ErrorBlock from "../../shared/components/ErrorBlock";

interface UserProfileProps {
  userId: string | undefined;
}

export default function UserProfile({ userId }: UserProfileProps) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users", userId],
    queryFn: ({ signal }) =>
      sendRequest<UserResponseType>(`/api/users/${userId}`, { signal }),
    staleTime: 10000,
  });
  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorBlock>{error.message}</ErrorBlock>;
  return (
    <section>
      <p>{data?.id}</p>
      <p>{data?.username}</p>
      <p>{data?.description}</p>
      <img src={data?.avatar} alt="" />
    </section>
  );
}
