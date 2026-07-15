import type { PostResponseType } from "../../posts/types/posts-types";

export type BaseUserResponseType = {
  id: string;
  username: string;
  avatar: string;
  description: string;
};

export type UserResponseType = BaseUserResponseType & {
  isFollowing: boolean;
};

export type getUserPostsResponseType = {
  posts: PostResponseType[];
  nextCursor: string | undefined;
};

export type FollowResponseType = {
  id: string;
  follower: string;
  following: string;
};
