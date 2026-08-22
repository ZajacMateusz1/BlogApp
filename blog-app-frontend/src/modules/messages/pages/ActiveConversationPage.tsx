// import { useInfiniteQuery } from "@tanstack/react-query";
// import { useParams } from "react-router-dom";

// import useAuth from "../../auth/hooks/useAuth";
// // import { sendRequest } from "../../../utils/http/http";
// import type { getMessagesResponseType } from "../types/messages-types";

export default function ActiveConversation() {
  // const { conversationId } = useParams();
  // const { token } = useAuth();
  // const {
  //   data,
  //   isLoading,
  //   isError,
  //   error,
  //   hasNextPage,
  //   fetchNextPage,
  //   isFetchingNextPage,
  // } = useInfiniteQuery({
  //   queryKey: ["conversation", conversationId],
  //   queryFn: ({ pageParam, signal }) =>
  //     sendRequest<getMessagesResponseType>(
  //       `/api/messages/${conversationId}/messages?limit=10${pageParam ? `&cursor=${pageParam}` : ""}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //         signal,
  //       },
  //     ),
  //   initialPageParam: "",
  //   getNextPageParam: (lastPage) => lastPage.nextCursor,
  // });
  return <section></section>;
}
