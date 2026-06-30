import type { PostResponseType } from "../../posts/types/posts-types";

export type UserResponseType = {
  id: string;
  username: string;
  avatar: string;
  description: string;
};

export type getUserPostsResponseType = {
  posts: PostResponseType[];
  nextCursor: string | undefined;
};
