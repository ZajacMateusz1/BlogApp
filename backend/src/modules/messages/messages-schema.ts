import { z } from "zod";

export const messageSchema = z.object({
  type: z.literal("chat_message"),
  payload: z.object({
    recipient: z.string().trim().min(1).max(50),
    content: z.string().trim().min(1).max(500),
  }),
});

export type MessagePayloadType = z.infer<typeof messageSchema>["payload"];
