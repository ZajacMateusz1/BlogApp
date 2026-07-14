import type { PostResponseType } from "../../posts/types/posts-types";

export type UserResponseType = {
  id: string;
  username: string;
  isFollowing: boolean;
  avatar: string;
  description: string;
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
