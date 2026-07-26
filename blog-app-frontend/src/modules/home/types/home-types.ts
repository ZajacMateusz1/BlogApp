import type { PostResponseType } from "../../posts/types/posts-types";

export type HomeFeedResponseType = {
  posts: PostResponseType[];
  nextCursor: string;
};
