import { getFollowings } from "../users/user-repository.js";
import { getpublicUrl } from "../../utils/supabaseHelpers.js";
import {
  getFollwingFeedRepository,
  getGlobalFeedRepository,
} from "./feed-repository.js";

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
          avatar: getpublicUrl(avatarPath),
        },
        image: getpublicUrl(imagePath),
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
          avatar: getpublicUrl(avatarPath),
        },
        image: getpublicUrl(imagePath),
        ...postData,
      });
    });
  }
  const nextCursor = posts.at(-1)?.id;
  return {
    posts,
    nextCursor,
  };
};
