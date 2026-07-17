import { Schema, model, Types } from "mongoose";
import { DEFAULT_AVATAR_PATH } from "../utils/supabaseHelpers.js";

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  avatarPath: {
    type: String,
    default: DEFAULT_AVATAR_PATH,
  },
  description: { type: String, default: "" },
  followersCount: { type: Number, default: 0 },
  followingsCount: { type: Number, default: 0 },
});

const User = model("User", userSchema);
export default User;
