import { Schema, model, Types } from "mongoose";

const messageSchema = new Schema(
  {
    sender: { type: Types.ObjectId, required: true, ref: "User" },
    recipient: { type: Types.ObjectId, required: true, ref: "User" },
    content: { type: String, required: true },
  },
  { timestamps: true },
);

const Message = model("Message", messageSchema);
export default Message;
