import useAuth from "../../../auth/hooks/useAuth";

import LikeButton from "./PostFooterButtons/LikeButton";
import CommentButton from "./PostFooterButtons/CommentButton";

interface PostFooterProps {
  postId: string | undefined;
  creatorId?: string;
  isLiked: boolean | undefined;
  likesCount: number | undefined;
  commentsCount: number | undefined;
}
export default function PostFooter({
  postId,
  creatorId,
  isLiked,
  likesCount,
  commentsCount,
}: PostFooterProps) {
  const { token } = useAuth();
  return (
    <footer className="border-t mt-4 p-2 border-border-light flex items-center gap-2 md:gap-4 lg:gap-6">
      <LikeButton
        isLiked={isLiked}
        postId={postId}
        creatorId={creatorId}
        likesCount={likesCount}
        token={token}
      />
      <CommentButton postId={postId} commentsCount={commentsCount} />
    </footer>
  );
}
