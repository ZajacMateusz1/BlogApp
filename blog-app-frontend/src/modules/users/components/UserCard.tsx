import type { FriendSuggestionType } from "../types/users-types";

import FollowButton from "./FollowButton";

interface UserCardProps {
  userData: FriendSuggestionType;
}
export default function UserCard({ userData }: UserCardProps) {
  return (
    <article className="rounded-xl bg-light p-1 md:p-1.5 lg:p-2 flex flex-col justify-center items-center">
      <div className="h-12 w-12 md:h-14 md:w-14 lg:h-16 lg:w-16">
        <img
          className="size-full"
          src={userData.avatar}
          alt={userData.username}
        />
      </div>
      <h3>{userData.username}</h3>
      <p>{userData.mutualFriends > 0 ? userData.mutualFriends : ""}</p>
      <FollowButton
        isFollowing={false}
        followingId={userData.id}
        invalidateQueryKey={["suggestions"]}
      />
    </article>
  );
}
