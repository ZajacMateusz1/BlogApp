import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../auth/hooks/useAuth";

import LoadingSpinner from "../../shared/components/LoadingSpinner";
import ErrorBlock from "../../shared/components/ErrorBlock";

import { sendRequest } from "../../../utils/http";
import type { PostResponseType } from "../types/posts-types";

export default function PostDetailsPage() {
  const { postId } = useParams();
  const { userId } = useAuth();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["posts", postId],
    queryFn: ({ signal }) =>
      sendRequest<PostResponseType>(
        `http://localhost:5000/api/posts/${postId}`,
        {
          signal,
        },
      ),
    staleTime: 10000,
  });
  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorBlock>{error.message}</ErrorBlock>;
  const isOwner = userId === data?.creator.id;
  return (
    <article>
      <header>
        <h1>{data?.title}</h1>
        <p>{new Date(data?.createdAt || "").toLocaleString()}</p>
        <p>{data?.creator.username}</p>
        {isOwner && <p>User can edit</p>}
      </header>
      {data?.image && <img src={data.image} alt="Post image" />}
      <p>{data?.description}</p>
    </article>
  );
}
