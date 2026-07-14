import { useParams, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../auth/hooks/useAuth";

import { sendRequest } from "../../../../utils/http/http";
import type { PostResponseType } from "../../types/posts-types";

import ErrorBlock from "../../../shared/components/ErrorBlock";
import LoadingSpinner from "../../../shared/components/LoadingSpinner";
import PostForm from "../../components/PostForm/PostForm";

export default function EditPostPage() {
  const { postId } = useParams();
  const { userId, token } = useAuth();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["posts", postId],
    queryFn: ({ signal }) =>
      sendRequest<PostResponseType>(`/api/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal,
      }),
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorBlock>{error.message}</ErrorBlock>;
  if (data?.creator.id !== userId) return <Navigate to="/" replace />;

  return (
    <PostForm
      postData={data}
      requestLink={`/api/posts/${postId}`}
      formTitle="Edit post"
      submitButtonText="Edit post"
      cancelLink={`/posts/${postId}`}
    ></PostForm>
  );
}
