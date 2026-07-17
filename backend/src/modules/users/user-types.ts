import type { Types } from "mongoose";
export type PopulatedSuggestionType = {
  following: {
    _id: Types.ObjectId;
    username: string;
    avatarPath: string;
    description: string;
  };
};
