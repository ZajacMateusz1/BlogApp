import type { Types } from "mongoose";

export type SuggestionType = {
  mutualFriends: number;
  suggestion: { _id: Types.ObjectId; username: string; avatarPath: string };
};
