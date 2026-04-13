import { z } from "zod";
console.log("CHUJJJ");
export const RegisterSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8, { error: "Min password length is 8" })
    .regex(/[a-zA-Z]/, {
      error: "Password must contain letter",
    })
    .regex(/\d/, {
      error: "Password must contain a number",
    }),
  username: z.string().trim().min(3, { error: "Min username length is 3" }),
});
export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
