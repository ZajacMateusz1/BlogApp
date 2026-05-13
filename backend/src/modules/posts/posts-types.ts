import type { Types } from "mongoose";

export type PopulatedPostType = {
  _id: Types.ObjectId;
  title: string;
  description: string;
  image: string;
  creator: {
    _id: Types.ObjectId;
    username: string;
  };
};
