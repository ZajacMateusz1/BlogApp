import type { PostSchemaType } from "../schemas/posts-schema";

export type PostResponseType = PostSchemaType & {
  id: string;
  creator: string;
  createdAt: Date;
  updatedAt: Date;
};
