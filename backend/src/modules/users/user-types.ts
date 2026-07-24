import type { Types } from "mongoose";

type BaseUserType = {
  _id: Types.ObjectId;
  username: string;
  avatarPath: string;
};

export type SuggestionType = {
  mutualFollowings: number;
  suggestion: BaseUserType;
};

export type PopulatedFollowerType = {
  follower: BaseUserType;
};

export type PopulatedFollowingType = {
  following: BaseUserType;
};
