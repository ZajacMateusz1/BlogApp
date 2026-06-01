import { z } from "zod";
export const PostSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { error: "Min title length is 1" })
    .max(120, { error: "Max title length is 120" }),
  description: z.string(),
});
export const EditPostSchema = PostSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    error: "You must provide at least one change",
  },
);
export type PostSchemaType = z.infer<typeof PostSchema>;
export type EditPostSchemaType = z.infer<typeof EditPostSchema>;
