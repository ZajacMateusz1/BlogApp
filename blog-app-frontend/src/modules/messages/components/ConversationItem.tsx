import { Link } from "react-router-dom";
import type { ConversationResponseType } from "../types/messages-types";

interface ConversationItemProps {
  conversation: ConversationResponseType;
}

export default function ConversationItem({
  conversation,
}: ConversationItemProps) {
  return (
    <Link
      to={`/conversations/${conversation.id}/${conversation.userData.id}`}
      className={`flex gap-2 p-2 border-b border-border-light md:gap-4 overflow-hidden hover:bg-conversation-hover ${conversation.isRead ? "bg-light" : "bg-not-read"}`}
    >
      <div className="shrink-0 flex justify-center items-center w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18">
        <img
          className="size-full rounded-full"
          src={conversation.userData.avatar}
          alt={conversation.userData.username}
        />
      </div>
      <div className="flex flex-col gap-1 justify-center overflow-hidden">
        <p className="text-primary hover:text-link-hover lg:text-lg">
          {conversation.userData.username}
        </p>
        {conversation.lastMessage && (
          <>
            <p className="text-sm text-secondary lg:text-base">
              {conversation.lastMessage.content}
            </p>
            <p className="text-xs text-secondary lg:text-sm">
              {new Date(conversation.lastMessage.createdAt).toLocaleString(
                undefined,
                {
                  dateStyle: "short",
                  timeStyle: "short",
                },
              )}
            </p>
          </>
        )}
      </div>
    </Link>
  );
}
