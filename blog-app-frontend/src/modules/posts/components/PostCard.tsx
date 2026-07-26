import { Link } from "react-router-dom";
import type { PostResponseType } from "../types/posts-types";
import PostFooter from "./PostFooter/PostFooter";

interface PostCardInterfaceProps {
  postData: PostResponseType;
}
export default function PostCard({ postData }: PostCardInterfaceProps) {
  return (
    <article className="bg-light rounded-xl p-3 md:p-4">
      <header className="mb-2 md:mb-4">
        <div className="user-data flex items-center mb-2 gap-2">
          <img
            className="w-10 h-10 rounded-lg sm:w-12 sm:h-12 md:w-14 md:h-14"
            src={postData.creator.avatar}
            alt="User avatar"
          ></img>
          <Link
            to={`/users/${postData.creator.id}`}
            className="font-semibold lg:text-lg text-link hover:text-link-hover"
          >
            {postData.creator.username}
          </Link>
        </div>
        <p className="text-xs lg:text-sm">
          {new Date(postData.createdAt).toLocaleString(undefined, {
            dateStyle: "short",
            timeStyle: "short",
          })}
        </p>
      </header>
      <Link
        className="group flex flex-col gap-2 md:gap-4"
        to={`/posts/${postData.id}`}
      >
        <div className="w-full h-48 overflow-hidden text-xs md:h-80 lg:h-96">
          <img
            className="object-cover size-full"
            src={postData.image}
            alt={postData.title}
          />
        </div>
        <h3 className="font-bold text-base group-hover:text-primary transition-colors md:text-lg lg:text-xl">
          {postData.title}
        </h3>
        <p className="line-clamp-3 md:text-base lg:text-xl">
          {postData.description}
        </p>
      </Link>
      <PostFooter
        postId={postData.id}
        creatorId={postData.creator.id}
        likesCount={postData.likesCount}
        isLiked={postData.isLiked}
        commentsCount={postData.commentsCount}
      />
    </article>
  );
}
