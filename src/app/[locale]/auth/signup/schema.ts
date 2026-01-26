import { z } from "zod";

export const signUpSchema = z.object({
  displayName: z.string().min(1).max(50),
  email: z.string().email(),
  password: z.string().min(6),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
