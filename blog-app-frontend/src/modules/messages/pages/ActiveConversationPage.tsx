import { useState, type SubmitEvent } from "react";
// import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
// import useAuth from "../../auth/hooks/useAuth";
import useWebSocket from "../../ws/hooks/useWebSocket";
import { Send } from "lucide-react";

import type { MessagePayloadType } from "../types/messages-types";
// import { sendRequest } from "../../../utils/http/http";
// import type { getMessagesResponseType } from "../types/messages-types";
import Button from "../../shared/components/Button";
import TextAreaElement from "../../shared/components/form/TextAreaElement";

export default function ActiveConversation() {
  const { recipientId } = useParams();
  // const { token } = useAuth();
  const { sendMessage } = useWebSocket();
  const [message, setMessage] = useState<string>("");
  const handleMessageChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setMessage(event.target.value);
  };

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

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!message.trim()) return;
    const messagePayload = {
      recipient: recipientId!,
      content: message,
    };
    sendMessage<MessagePayloadType>({
      type: "chat_message",
      payload: messagePayload,
    });
    setMessage("");
  };

  return (
    <section className="max-w-3xl mx-auto flex flex-col gap-4 p-2 md:p-4 bg-light">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <TextAreaElement
          className="w-full"
          placeholder="Write your message..."
          name="message"
          value={message}
          onChange={handleMessageChange}
        >
          {""}
        </TextAreaElement>
        <Button
          className="self-end flex justify-center items-center"
          type="submit"
        >
          <Send />
          <span>Send</span>
        </Button>
      </form>
    </section>
  );
}
