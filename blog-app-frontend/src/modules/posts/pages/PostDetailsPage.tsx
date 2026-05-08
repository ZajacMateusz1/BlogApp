import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import LoadingSpinner from "../../shared/components/LoadingSpinner";
import ErrorBlock from "../../shared/components/ErrorBlock";

import { sendRequest } from "../../../utils/http";
import type { PostSchemaType } from "../schemas/posts-schema";

export default function PostDetailsPage() {
  const { postId } = useParams();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["posts", postId],
    queryFn: ({ signal }) =>
      sendRequest<PostSchemaType>(`http://localhost:5000/api/posts/${postId}`, {
        signal,
      }),
    staleTime: 10000,
  });
  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorBlock>{error.message}</ErrorBlock>;
  return <div>{data?.title}</div>;
}
