import { Schema, model, Types } from "mongoose";

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  posts: [{ type: Types.ObjectId, required: true, ref: "Post" }],
});

const User = model("User", userSchema);
export default User;
