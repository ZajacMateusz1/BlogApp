import { useRef, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import useAuth from "../../../auth/hooks/useAuth";

import { sendRequest } from "../../../../utils/http/http";
import type { getCommentsResponseType } from "../../types/posts-types";
import LoadingSpinner from "../../../shared/components/LoadingSpinner";

import CommentForm from "./CommentForm";
import CommentCard from "./CommentCard";
import ErrorBlock from "../../../shared/components/ErrorBlock";

interface CommentSectionProps {
  postId: string | undefined;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const { token } = useAuth();
  const loaderRef = useRef(null);
  const {
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryFn: ({ pageParam, signal }) =>
      sendRequest<getCommentsResponseType>(
        `/api/posts/${postId}/comments?limit=10${pageParam ? `&cursor=${pageParam}` : ""}`,
        {
          signal,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      ),
    queryKey: ["comments", postId],
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  useEffect(() => {
    if (!loaderRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        rootMargin: "250px",
      },
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorBlock>{error.message}</ErrorBlock>;
  return (
    <section className="flex flex-col gap-1 md:gap-2 lg:gap-4">
      <h2 className="font-bold md:text-lg lg:text-xl">Comments</h2>
      <CommentForm postId={postId} token={token} />
      {data?.pages.map((page) =>
        page.comments.map((comment) => (
          <CommentCard comment={comment} key={comment.id} />
        )),
      )}
      <div ref={loaderRef} className="loader"></div>
    </section>
  );
}
