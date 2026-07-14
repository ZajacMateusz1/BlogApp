import type { CommentResponseType } from "../../types/posts-types";

interface CommentCardProps {
  comment: CommentResponseType;
}

export default function CommentCard({ comment }: CommentCardProps) {
  return (
    <div>
      <div>
        <img src={comment.author.avatar} alt={comment.author.username} />
      </div>
      <div>
        <h3>{comment.author.username}</h3>
        <p>{comment.createdAt}</p>
        <p>{comment.content}</p>
      </div>
    </div>
  );
}
