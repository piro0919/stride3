"use server";
import { signUpSchema } from "./schema";
import { createClient } from "@/lib/supabase/server";

export type SignUpState = {
  error?: string;
  success?: boolean;
};

export async function signUp(
  _prevState: SignUpState,
  formData: FormData,
): Promise<SignUpState> {
  const parsed = signUpSchema.safeParse({
    displayName: formData.get("displayName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "VALIDATION_ERROR" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    options: {
      data: {
        display_name: parsed.data.displayName,
      },
    },
    password: parsed.data.password,
  });

  if (error) {
    if (error.message.includes("already registered")) {
      return { error: "EMAIL_ALREADY_EXISTS" };
    }
    return { error: error.message };
  }

  return { success: true };
}
