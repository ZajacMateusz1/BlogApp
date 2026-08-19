import { Schema, model, Types } from "mongoose";

const messageSchema = new Schema(
  {
    sender: { type: Types.ObjectId, required: true, ref: "User" },
    recipient: { type: Types.ObjectId, required: true, ref: "User" },
    content: { type: String, required: true },
    conversation: { type: Types.ObjectId, required: true, ref: "Conversation" },
  },
  { timestamps: true },
);

const Message = model("Message", messageSchema);
export default Message;
