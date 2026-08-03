import { Schema, model, Types } from "mongoose";

const notificationSchema = new Schema(
  {
    recipient: { type: Types.ObjectId, required: true, ref: "User" },
    actor: { type: Types.ObjectId, required: true, ref: "User" },
    post: { type: Types.ObjectId, ref: "Post" },
    isRead: { type: Boolean, default: false },
    type: { type: String, enum: ["like", "comment", "follow"], required: true },
  },
  { timestamps: true },
);

const Notification = model("Notification", notificationSchema);
export default Notification;
