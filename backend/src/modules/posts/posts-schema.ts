import { z } from "zod";
export const PostSchema = z.object({
  title: z
    .string()
    .min(1, { error: "Min title length is 1" })
    .max(120, { error: "Max title length is 120" }),
  image: z.string(),
  description: z.string(),
});
export type PostSchemaType = z.infer<typeof PostSchema>;
