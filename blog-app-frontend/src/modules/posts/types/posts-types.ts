type BaseResponseType = {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string;
  image: string;
};

export type PostResponseType = BaseResponseType & {
  creator: {
    id: string;
    username: string;
    avatar: string;
  };
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
};

export type MutatePostResponseType = BaseResponseType & {
  creator: string;
};

type BaseCommentType = {
  id: string;
  content: string;
  createdAt: string;
};
export type CommentResponseType = BaseCommentType & {
  author: { id: string; username: string; avatar: string };
};
export type MutateCommentResponseType = BaseCommentType & {
  author: string;
};

export type getCommentsResponseType = {
  comments: CommentResponseType[];
  nextCursor: string | undefined;
  createdAt: string;
};
