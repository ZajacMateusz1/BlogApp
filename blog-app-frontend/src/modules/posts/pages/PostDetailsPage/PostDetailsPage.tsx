import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../auth/hooks/useAuth";

import LoadingSpinner from "../../../shared/components/LoadingSpinner";
import ErrorBlock from "../../../shared/components/ErrorBlock";
import PostDetailsButtons from "../../components/PostDetailsButtons/PostDetailsButtons";
import PostFooter from "../../components/PostFooter/PostFooter";
import CommentSection from "../../components/Comment/CommentSection";

import { sendRequest } from "../../../../utils/http/http";
import type { PostResponseType } from "../../types/posts-types";

export default function PostDetailsPage() {
  const { postId } = useParams();
  const { userId, token } = useAuth();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["posts", postId],
    queryFn: ({ signal }) =>
      sendRequest<PostResponseType>(`/api/posts/${postId}`, {
        signal,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    staleTime: 10000,
  });
  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorBlock>{error.message}</ErrorBlock>;
  const isOwner = userId === data?.creator.id;
  return (
    <article className="bg-white rounded-md my-2 px-2 py-4 max-w-2xl mx-auto md:my-6 md:px-4 md:py-6">
      <header className="flex justify-between">
        <div>
          <div className="user-data flex items-center mb-2 gap-2">
            <img
              className="w-12 h-12 rounded-lg sm:w-14 sm:h-14 md:w-16 md:h-16"
              src={data?.creator.avatar}
              alt="User avatar"
            ></img>
            <Link
              className="text-link hover:text-link-hover md:text-base lg:text-lg"
              to={`/users/${data?.creator.id}`}
            >
              {data?.creator.username}
            </Link>
          </div>
          <p className="text-sm font-semibold md:text-base lg:text-md">
            Posted:
          </p>
          <p className="text-xs mb-2 md:text-xs lg:text-md">
            {new Date(data?.createdAt || "").toLocaleString(undefined, {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </p>
        </div>
        {isOwner && <PostDetailsButtons postId={postId!} token={token!} />}
      </header>
      <h1 className="font-bold text-center text-2xl mb-2 md:text-3xl lg:text-4xl">
        {data?.title}
      </h1>
      <div className="aspect-video overflow-hidden w-full mb-4">
        <img
          className="h-full w-full object-contain"
          src={data?.image}
          alt={`${data?.title}`}
        />
      </div>

      <p className="px-1.5 py-2 bg-bg-primary border-l-2 border-primary md:text-base wrap-break-word">
        {data?.description}
      </p>
      <PostFooter
        postId={data?.id}
        likeQueryKeyId={data.id}
        isLiked={data?.isLiked}
        likesCount={data?.likesCount}
        commentsCount={data?.commentsCount}
      />
      <CommentSection postId={postId} />
    </article>
  );
}
