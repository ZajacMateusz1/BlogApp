import type { Types } from "mongoose";

export type SuggestionType = {
  mutualFollowings: number;
  suggestion: { _id: Types.ObjectId; username: string; avatarPath: string };
};
