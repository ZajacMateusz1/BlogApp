import type { PostSchemaType } from "../schemas/posts-schema";

type BaseResponseType = PostSchemaType & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export type PostResponseType = BaseResponseType & {
  creator: {
    id: string;
    username: string;
  };
};

export type AddPostResponseType = BaseResponseType & {
  creator: string;
};

export type EditPostResponseType = AddPostResponseType;
