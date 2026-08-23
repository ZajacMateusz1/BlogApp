import { Link } from "react-router-dom";
import type {
  BaseUserResponseType,
  FollowListItemType,
} from "../types/users-types";
interface UserSearchCardProps {
  userData: BaseUserResponseType | FollowListItemType;
  onClick?: (param?: string) => void;
  isLink?: boolean;
  isLoading?: boolean;
}
export default function UserSearchCard({
  userData,
  onClick,
  isLink = true,
  isLoading = false,
}: UserSearchCardProps) {
  const content = (
    <>
      <div className="shrink-0 flex justify-center items-center w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18">
        <img
          className="size-full rounded-full"
          src={userData.avatar}
          alt={userData.username}
        />
      </div>
      <div className="flex flex-col gap-1 justify-center items-center">
        <p className="text-primary hover:text-link-hover lg:text-lg">
          {userData.username}
        </p>
      </div>
    </>
  );
  const parentStyles =
    "flex gap-2 p-2 border-b border-border-light md:gap-4 overflow-hidden hover:bg-bg-primary";
  if (isLink)
    return (
      <Link
        to={`/users/${userData.id}`}
        onClick={() => onClick?.()}
        className={parentStyles}
      >
        {content}
      </Link>
    );
  return (
    <button
      onClick={() => onClick?.(userData.id)}
      disabled={isLoading}
      className={`${parentStyles} block w-full cursor-pointer`}
    >
      {content}
    </button>
  );
}
