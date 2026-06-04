import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../auth/hooks/useAuth";

import LoadingSpinner from "../../shared/components/LoadingSpinner";
import ErrorBlock from "../../shared/components/ErrorBlock";
import PostDetailsButtons from "../components/PostDetailsButtons";

import { sendRequest } from "../../../utils/http";
import type { PostResponseType } from "../types/posts-types";

export default function PostDetailsPage() {
  const { postId } = useParams();
  const { userId, token } = useAuth();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["posts", postId],
    queryFn: ({ signal }) =>
      sendRequest<PostResponseType>(`/api/posts/${postId}`, {
        signal,
      }),
    staleTime: 10000,
  });
  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorBlock>{error.message}</ErrorBlock>;
  const isOwner = userId === data?.creator.id;
  return (
    <article className="bg-white rounded-md px-2 py-4 max-w-2xl mx-auto md:px-4 md:py-6">
      <header className="flex justify-between">
        <div>
          <Link
            className="text-link hover:text-link-hover"
            to={`/users/${data?.creator.id}`}
          >
            {data?.creator.username}
          </Link>
          <p className="text-xs mb-2">
            {new Date(data?.createdAt || "").toLocaleString(undefined, {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </p>
          <h1 className="font-bold text-xl mb-2">{data?.title}</h1>
        </div>
        {isOwner && <PostDetailsButtons postId={postId!} token={token!} />}
      </header>
      <div className="aspect-video overflow-hidden w-full mb-4">
        <img
          className="h-full w-full object-contain"
          src={data?.image}
          alt={`${data?.title}`}
        />
      </div>

      <p className="px-1.5 py-2 bg-bg-primary border-l-2 border-primary">
        {data?.description}
      </p>
    </article>
  );
}
