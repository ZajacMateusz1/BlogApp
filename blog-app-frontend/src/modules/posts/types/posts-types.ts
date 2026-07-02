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
  isLiked: boolean;
};

export type MutatePostResponseType = BaseResponseType & {
  creator: string;
};
