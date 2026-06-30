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
  const { data, isLoading, isError, error, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["posts", userId],
      queryFn: ({ pageParam, signal }) =>
        sendRequest<getUserPostsResponseType>(
          `/api/users/${userId}/posts?limit=10${pageParam ? `&cursor=${pageParam}` : ""}`,
          { signal },
        ),
      initialPageParam: "",
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });
  console.log(data);
  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorBlock>{error.message}</ErrorBlock>;
  return (
    <section>
      <h2>Latest posts:</h2>
      {data?.pages.map((page) =>
        page.posts.map((post) => <PostCard postData={post} />),
      )}
    </section>
  );
}
