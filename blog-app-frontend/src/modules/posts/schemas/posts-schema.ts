import { z } from "zod";
export const CreatePostSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { error: "Min title length is 1" })
    .max(120, { error: "Max title length is 120" }),
  image: z
    .file({ error: "Please select file" })
    .refine(
      (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
      { error: "Only JPG and PNG files are allowed" },
    ),
  description: z.string(),
});
export const EditPostSchema = CreatePostSchema.extend({
  image: z
    .file()
    .refine(
      (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
      { error: "Only JPG and PNG files are allowed" },
    )
    .optional(),
});
export type CreatePostSchemaType = z.infer<typeof CreatePostSchema>;
export type EditPostSchemaType = z.infer<typeof EditPostSchema>;

export const CommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, { error: "Min comment length is 1" })
    .max(500, { error: "Max comment length is 500" }),
});

export type CommentSchemaType = z.infer<typeof CommentSchema>;
