"use server";
import { signInSchema } from "./schema";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export type SignInState = {
  error?: string;
};

async function getClientIp(): Promise<string> {
  const headersList = await headers();
  return (
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip") ||
    "unknown"
  );
}

export async function signIn(
  _prevState: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const ip = await getClientIp();
  const rateLimitResult = checkRateLimit(getRateLimitKey(ip, "login"), {
    maxAttempts: 5,
    windowMs: 60000,
  });

  if (!rateLimitResult.success) {
    return { error: "TOO_MANY_ATTEMPTS" };
  }

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
    // Don't expose internal error details to users
    return { error: "INVALID_CREDENTIALS" };
  }

  revalidatePath("/", "layout");
  redirect(redirectTo || "/ja/teams");
}

export async function signOut(): Promise<never> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/ja/signin");
}
