import { z } from "zod";
export const LoginSchema = z.object({
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
});
export const RegisterSchema = LoginSchema.extend({
  username: z.string().trim().min(3, { error: "Min username length is 3" }),
  repeatPassword: z.string(),
}).refine((data) => data.password === data.repeatPassword, {
  error: "Passwords are not the same",
  path: ["repeatPassword"],
});
export type LoginSchemaType = z.infer<typeof LoginSchema>;
export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
