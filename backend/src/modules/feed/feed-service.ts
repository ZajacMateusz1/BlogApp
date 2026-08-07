import { getFollowings } from "../users/user-repository.js";
import { getPublicUrl } from "../../utils/supabaseHelpers.js";
import {
  getFollwingFeedRepository,
  getGlobalFeedRepository,
} from "./feed-repository.js";
import { getUserPostsIsLiked } from "../users/user-repository.js";

export const getFeedService = async (
  userId: string,
  cursor: string | undefined,
  limit: number,
) => {
  const followings = await getFollowings(userId);
  const followingFeed = await getFollwingFeedRepository(
    cursor,
    limit,
    followings,
  );
  const posts = followingFeed.map(
    ({ _id, creator, imagePath, ...postData }) => {
      const { _id: creatorId, avatarPath, ...userData } = creator;
      return {
        id: _id,
        creator: {
          id: creatorId,
          ...userData,
          avatar: getPublicUrl(avatarPath),
        },
        image: getPublicUrl(imagePath),
        ...postData,
      };
    },
  );
  if (followingFeed.length < limit) {
    const globalFeed = await getGlobalFeedRepository(cursor, limit, followings);
    globalFeed.forEach(({ _id, creator, imagePath, ...postData }) => {
      const { _id: creatorId, avatarPath, ...userData } = creator;
      posts.push({
        id: _id,
        creator: {
          id: creatorId,
          ...userData,
          avatar: getPublicUrl(avatarPath),
        },
        image: getPublicUrl(imagePath),
        ...postData,
      });
    });
  }
  const likes = await getUserPostsIsLiked(
    userId,
    posts.map((post) => post.id),
  );
  const likesSet = new Set();
  likes.forEach(({ post }) => likesSet.add(post.toString()));
  const nextCursor = posts.at(-1)?.id;
  return {
    posts: posts.map((postData) => ({
      ...postData,
      isLiked: likesSet.has(postData.id.toString()),
    })),
    nextCursor,
  };
};
