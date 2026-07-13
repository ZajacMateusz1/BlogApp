import type { Types } from "mongoose";

export type PopulatedPostType = {
  _id: Types.ObjectId;
  title: string;
  description: string;
  imagePath: string;
  creator: {
    _id: Types.ObjectId;
    username: string;
    avatarPath: string;
  };
};

export type PopulatedCommentType = {
  _id: Types.ObjectId;
  content: string;
  author: {
    _id: Types.ObjectId;
    username: string;
    avatarPath: string;
  };
};
