import { Link } from "react-router-dom";
import type { CommentResponseType } from "../../types/posts-types";

interface CommentCardProps {
  comment: CommentResponseType;
}

export default function CommentCard({ comment }: CommentCardProps) {
  return (
    <div className="flex gap-2 p-2 border-t border-border-light md:gap-4 overflow-hidden">
      <div className="shrink-0 flex justify-center items-center w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18">
        <img
          className="size-full rounded-full"
          src={comment.author.avatar}
          alt={comment.author.username}
        />
      </div>
      <div>
        <Link
          className="text-primary hover:text-link-hover lg:text-lg"
          to={`/users/${comment.author.id}`}
        >
          {comment.author.username}
        </Link>
        <p className="break-all text-xs md:text-sm lg:text-base">
          {comment.content}
        </p>
      </div>
    </div>
  );
}
