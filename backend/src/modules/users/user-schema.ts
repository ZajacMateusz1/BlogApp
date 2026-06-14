import { z } from "zod";

export const EditUserSchema = z.object({
  username: z.string().trim().min(3, { error: "Min username length is 3" }),
  description: z.string(),
});

export type EditUserSchemaType = z.infer<typeof EditUserSchema>;
