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
  if (!data?.length) return null;
  return (
    <section className="p-3 md:p-4 ">
      <h2 className="text-lg md:text-xl lg:text-2xl mb-1 md:mb-2 lg:mb-3">
        People you may know
      </h2>
      <div className="flex justify-center gap-3 overflow-x-scroll">
        {data?.map((friendSuggestion) => (
          <UserCard key={friendSuggestion.id} userData={friendSuggestion} />
        ))}
      </div>
    </section>
  );
}
