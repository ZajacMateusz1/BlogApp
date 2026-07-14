import { Link } from "react-router-dom";
import { MessageCircleMore } from "lucide-react";
interface CommentButtonProps {
  postId: string | undefined;
  commentsCount: number | undefined;
}
export default function CommentButton({
  postId,
  commentsCount,
}: CommentButtonProps) {
  return (
    <Link to={`/posts/${postId}`} className="text-center">
      <MessageCircleMore />
      <span>{commentsCount}</span>
    </Link>
  );
}
