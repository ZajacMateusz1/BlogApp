import { useQuery } from "@tanstack/react-query";

import { sendRequest } from "../../../utils/http/http";
import type { UserResponseType } from "../types/users-types";

import LoadingSpinner from "../../shared/components/LoadingSpinner";
import ErrorBlock from "../../shared/components/ErrorBlock";
import ProfileButton from "./ProfileButton";

import PROFILECOVER from "../../../assets/profile-cover.png";

interface UserProfileProps {
  profileId: string | undefined;
}

export default function UserProfile({ profileId }: UserProfileProps) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users", profileId],
    queryFn: ({ signal }) =>
      sendRequest<UserResponseType>(`/api/users/${profileId}`, { signal }),
    staleTime: 10000,
  });
  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorBlock>{error.message}</ErrorBlock>;
  return (
    <article className="bg-light flex flex-col gap-2 items-center p-3 rounded-xl md:gap-6 md:p-4">
      <div
        className="relative aspect-3/1 w-full bg-cover bg-center bg-no-repeat rounded-xl md:aspect-5/1"
        style={{ backgroundImage: `url(${PROFILECOVER})` }}
      >
        <div className="size-24 overflow-hidden rounded-full absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 md:size-28 lg:size-32">
          <img
            className="object-cover size-full"
            src={data?.avatar}
            alt={data?.username}
          />
        </div>
      </div>
      <h2 className="font-bold pt-16 text-lg md:text-xl lg:text-2xl">
        {data?.username}
      </h2>
      <p className="text-center mb-2 px-4 md:px-8 text-sm md:text-base lg:text-lg">
        {data?.description}
      </p>
      <ProfileButton profileId={profileId} />
    </article>
  );
}
