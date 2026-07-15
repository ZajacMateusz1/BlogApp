import { Link } from "react-router-dom";
import type { BaseUserResponseType } from "../types/users-types";
interface UserCardProps {
  userData: BaseUserResponseType;
}
export default function UserCard({ userData }: UserCardProps) {
  return (
    <Link
      to={`/users/${userData.id}`}
      className="flex gap-2 p-2 border-b border-border-light md:gap-4 overflow-hidden hover:bg-bg-primary"
    >
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
        <p className="break-all text-xs md:text-sm lg:text-base">
          {userData.description}
        </p>
      </div>
    </Link>
  );
}
