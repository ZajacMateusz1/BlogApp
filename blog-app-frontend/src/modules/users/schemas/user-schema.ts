import { z } from "zod";

export const EditUserSchema = z
  .object({
    username: z.string().trim().min(3, { error: "Min username length is 3" }),
    avatar: z
      .file({ error: "Please select file" })
      .refine(
        (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
        { error: "Only JPG and PNG files are allowed" },
      ),
    description: z.string(),
  })
  .partial();

export type EditUserSchemaType = z.infer<typeof EditUserSchema>;
