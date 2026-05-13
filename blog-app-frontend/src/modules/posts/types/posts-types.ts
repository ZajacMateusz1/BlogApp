import type { PostSchemaType } from "../schemas/posts-schema";

export type PostResponseType = PostSchemaType & {
  id: string;
  creator: {
    id: string;
    username: string;
  };
  createdAt: string;
  updatedAt: string;
};
