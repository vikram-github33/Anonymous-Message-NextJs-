import { z } from "zod";

export const UsernameValidation = z
  .string()
  .min(1, "Username must be atleast 2 Characters")
  .max(20, "Username must not contain more than 20 characters");

export const signUpSchema = z.object({
  username: UsernameValidation,
  email: z.string().email({ message: "Invalid Email" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 Character" }),
});
