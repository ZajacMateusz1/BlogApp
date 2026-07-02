import useAuth from "../../../auth/hooks/useAuth";

import LikeButton from "./PostFooterButtons/LikeButton";
import CommentButton from "./PostFooterButtons/CommentButton";

interface PostFooterProps {
  postId: string | undefined;
  isLiked: boolean | undefined;
  likesCount: number | undefined;
}
export default function PostFooter({
  postId,
  isLiked,
  likesCount,
}: PostFooterProps) {
  const { token } = useAuth();
  return (
    <footer className="border-t mt-4 p-2 border-gray-400 flex items-center gap-2 md:gap-4 lg:gap-6">
      <LikeButton
        isLiked={isLiked}
        postId={postId}
        likesCount={likesCount}
        token={token}
      />
      <CommentButton postId={postId} />
    </footer>
  );
}
