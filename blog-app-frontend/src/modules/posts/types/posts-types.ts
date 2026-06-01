type BaseResponseType = {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string;
  image: string | null;
};

export type PostResponseType = BaseResponseType & {
  creator: {
    id: string;
    username: string;
  };
};

export type MutatePostResponseType = BaseResponseType & {
  creator: string;
};
