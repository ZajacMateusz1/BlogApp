import { useRef, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

import { sendRequest } from "../../../utils/http/http";
import type { getUserPostsResponseType } from "../types/users-types";

import LoadingSpinner from "../../shared/components/LoadingSpinner";
import ErrorBlock from "../../shared/components/ErrorBlock";
import PostCard from "../../posts/components/PostCard";

interface UserPostsProps {
  userId: string | undefined;
}
export default function UserPosts({ userId }: UserPostsProps) {
  const loaderRef = useRef(null);
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["posts", userId],
    queryFn: ({ pageParam, signal }) =>
      sendRequest<getUserPostsResponseType>(
        `/api/users/${userId}/posts?limit=10${pageParam ? `&cursor=${pageParam}` : ""}`,
        { signal },
      ),
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  useEffect(() => {
    if (!loaderRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!isFetchingNextPage && entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "250px" },
    );
    observer.observe(loaderRef.current);
    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, isFetchingNextPage, hasNextPage]);

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorBlock>{error.message}</ErrorBlock>;
  return (
    <section className="flex flex-col gap-4 mt-6">
      <h2 className="font-semibold">Posts:</h2>
      {data?.pages.map((page) =>
        page.posts.map((post) => <PostCard postData={post} />),
      )}
      <div ref={loaderRef} className="loader"></div>
    </section>
  );
}
