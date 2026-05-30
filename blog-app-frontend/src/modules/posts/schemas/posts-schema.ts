import { z } from "zod";
export const PostSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { error: "Min title length is 1" })
    .max(120, { error: "Max title length is 120" }),
  image: z
    .file()
    .refine(
      (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
      { error: "Only JPG and PNG files are allowed" },
    )
    .optional(),
  description: z.string(),
});
export type PostSchemaType = z.infer<typeof PostSchema>;
