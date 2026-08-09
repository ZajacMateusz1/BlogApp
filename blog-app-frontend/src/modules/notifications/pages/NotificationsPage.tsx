import { useEffect, useRef } from "react";
import {
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import useAuth from "../../auth/hooks/useAuth";
import useToast from "../../shared/hooks/useToast";

import { sendRequest } from "../../../utils/http/http";
import type { NotificationResponseType } from "../types/notifications-types";
import LoadingSpinner from "../../shared/components/LoadingSpinner";
import ErrorBlock from "../../shared/components/ErrorBlock";

import NotificationItem from "../components/NotificationItem";

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  const { addToast } = useToast();
  const { mutate: markAsRead } = useMutation({
    mutationFn: () =>
      sendRequest<null>("/api/notifications/read", {
        headers: { Authorization: `Bearer ${token}` },
        method: "PATCH",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      addToast(error.message, "error");
    },
  });
  useEffect(() => {
    return () => {
      markAsRead();
    };
  }, [markAsRead]);

  const observerRef = useRef(null);
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: ({ pageParam, signal }) =>
      sendRequest<NotificationResponseType>(
        `/api/notifications?limit=10${pageParam ? `&cursor=${pageParam}` : ""}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          signal,
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
      { rootMargin: "250px" },
    );
    observer.observe(observerRef.current);
    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorBlock>{error.message}</ErrorBlock>;
  if (data?.pages[0].notifications.length === 0)
    return <section className="max-w-3xl mx-auto">No notifications</section>;
  return (
    <section className="max-w-3xl mx-auto flex flex-col gap-4 md:gap-6 lg:gap-8">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center">
        Your Notifications
      </h1>
      <ul className="flex flex-col gap-1 md:gap-2 lg:gap-3">
        {data?.pages.map((page) =>
          page.notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
            />
          )),
        )}
      </ul>
      <div ref={observerRef}></div>
    </section>
  );
}
