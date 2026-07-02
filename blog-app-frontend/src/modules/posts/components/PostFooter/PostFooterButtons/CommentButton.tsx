import { useMutation } from "@tanstack/react-query";
import { MessageCircleMore } from "lucide-react";
import { sendRequest } from "../../../../../utils/http/http";
interface CommentButtonProps {
  postId: string | undefined;
}
export default function CommentButton({ postId }: CommentButtonProps) {
  const { isPending } = useMutation({
    mutationFn: () => sendRequest<null>(`${postId}`, {}),
  });
  return (
    <button className="cursor-pointer" disabled={isPending}>
      <MessageCircleMore />
      <span>217</span>
    </button>
  );
}
