import { Schema, model } from "mongoose";

const conversationSchema = new Schema(
  {
    user1: { type: Schema.Types.ObjectId, ref: "User", required: true },
    user2: { type: Schema.Types.ObjectId, ref: "User", required: true },
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
    IsReadUser1: { type: Boolean, default: false },
    IsReadUser2: { type: Boolean, default: false },
  },
  { timestamps: true },
);

conversationSchema.index({ user1: 1, user2: 1 }, { unique: true });

const Conversation = model("Conversation", conversationSchema);

export default Conversation;
