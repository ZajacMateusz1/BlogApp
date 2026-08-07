import { useRef, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { sendRequest } from "../../../utils/http/http";
import type { HomeFeedResponseType } from "../types/home-types";
import LoadingSpinner from "../../shared/components/LoadingSpinner";
import ErrorBlock from "../../shared/components/ErrorBlock";
import PostCard from "../../posts/components/PostCard";

interface FeedProps {
  token: string | null;
}

export default function Feed({ token }: FeedProps) {
  const observerRef = useRef(null);
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["posts", "feed"],
    queryFn: ({ signal, pageParam }) =>
      sendRequest<HomeFeedResponseType>(
        `/api/feed?limit=10${pageParam ? `&cursor=${pageParam}` : ""}`,
        {
          signal,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      ),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: "",
  });
  useEffect(() => {
    if (!observerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);
  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorBlock>{error.message}</ErrorBlock>;
  return (
    <section className="p-3 md:p-4">
      <h2 className="text-center font-bold text-xl md:text-2xl lg:text-3xl mb-2 md:mb-2 lg:mb-3">
        Latest Posts
      </h2>
      <ul className="flex flex-col gap-4 md:gap-6 lg:gap-8">
        {data?.pages.map(({ posts }) =>
          posts.map((post) => (
            <li key={post.id}>
              <PostCard likeQueryKeyId="feed" postData={post} />
            </li>
          )),
        )}
      </ul>
      <div ref={observerRef}></div>
    </section>
  );
}
