import type { PostResponseType } from "../../posts/types/posts-types";

export type BaseUserResponseType = {
  id: string;
  username: string;
  avatar: string;
  description: string;
  followersCount: number;
  followingsCount: number;
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

export type FollowListItemType = {
  username: string;
  id: string;
  avatar: string;
};

export type FriendSuggestionType = FollowListItemType & {
  mutualFollowings: number;
};

export type getFollowListResponseType = {
  users: FollowListItemType[];
  nextCursor: string | undefined;
};
