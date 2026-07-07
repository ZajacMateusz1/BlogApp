import { z } from "zod";

export const EditUserSchema = z
  .object({
    username: z.string().trim().min(3, { error: "Min username length is 3" }),
    description: z.string(),
  })
  .partial();

export const FollowSchema = z.object({
  followingId: z
    .string()
    .trim()
    .min(1, { error: "Min followingId length is 1" }),
});

export type EditUserSchemaType = z.infer<typeof EditUserSchema>;
export type FollowSchemaType = z.infer<typeof FollowSchema>;
