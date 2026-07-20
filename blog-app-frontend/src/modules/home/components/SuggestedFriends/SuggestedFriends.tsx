import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../auth/hooks/useAuth";

import { sendRequest } from "../../../../utils/http/http";
import type { FriendSuggestionType } from "../../../users/types/users-types";

import LoadingSpinner from "../../../shared/components/LoadingSpinner";
import ErrorBlock from "../../../shared/components/ErrorBlock";

import UserCard from "../../../users/components/UserCard";

export default function SuggestedFriends() {
  const { token } = useAuth();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["suggestions"],
    queryFn: ({ signal }) =>
      sendRequest<FriendSuggestionType[]>("/api/users/suggestions", {
        signal,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
  });
  if (isLoading) return <LoadingSpinner fullScreen={false} />;
  if (isError) return <ErrorBlock>{error.message}</ErrorBlock>;
  return (
    <section className="p-3 md:p-4 flex">
      {data?.map((friendSuggestion) => (
        <UserCard key={friendSuggestion.id} userData={friendSuggestion} />
      ))}
    </section>
  );
}
