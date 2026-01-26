"use server";
import { signInSchema } from "./schema";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type SignInState = {
  error?: string;
};

export async function signIn(
  _prevState: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const redirectTo = formData.get("redirect") as null | string;
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "VALIDATION_ERROR" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    if (error.message.includes("Invalid login credentials")) {
      return { error: "INVALID_CREDENTIALS" };
    }
    return { error: error.message };
  }

  redirect(redirectTo || "/ja/teams");
}

export async function signOut(): Promise<never> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/ja/auth/signin");
}
