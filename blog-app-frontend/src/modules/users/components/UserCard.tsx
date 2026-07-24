import { Link } from "react-router-dom";
import type { FriendSuggestionType } from "../types/users-types";

import FollowButton from "./FollowButton";

interface UserCardProps {
  userData: FriendSuggestionType;
}
export default function UserCard({ userData }: UserCardProps) {
  return (
    <article className="min-w-40 max-w-60 rounded-xl bg-light p-1 pb-2 md:p-1.5 md:pb-3 lg:p-2 lg:pb-4 flex flex-col gap-2 justify-center items-center">
      <div className="size-full">
        <img
          className="size-full"
          src={userData.avatar}
          alt={userData.username}
        />
      </div>
      <Link
        className="text-primary hover:text-link-hover"
        to={`/users/${userData.id}`}
      >
        {userData.username}
      </Link>
      <FollowButton
        isFollowing={false}
        followingId={userData.id}
        invalidateQueryKey={["suggestions"]}
      />
      <div className="mt-3 min-h-12 text-center text-sm text-secondary">
        {userData.mutualFollowings > 0 && (
          <p>
            Followed by {userData.mutualFollowings}
            {userData.mutualFollowings === 1
              ? " account you follow"
              : " accounts you follow"}
          </p>
        )}
      </div>
    </article>
  );
}
