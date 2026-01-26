"use server";
import { signUpSchema } from "./schema";
import { env } from "@/env";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

export type SignUpState = {
  error?: string;
  requiresEmailConfirmation?: boolean;
  success?: boolean;
};

async function getClientIp(): Promise<string> {
  const headersList = await headers();
  return (
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip") ||
    "unknown"
  );
}

export async function signUp(
  _prevState: SignUpState,
  formData: FormData,
): Promise<SignUpState> {
  const ip = await getClientIp();
  const rateLimitResult = checkRateLimit(getRateLimitKey(ip, "signup"), {
    maxAttempts: 3,
    windowMs: 60000,
  });

  if (!rateLimitResult.success) {
    return { error: "TOO_MANY_ATTEMPTS" };
  }

  const parsed = signUpSchema.safeParse({
    displayName: formData.get("displayName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "VALIDATION_ERROR" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    options: {
      data: {
        display_name: parsed.data.displayName,
      },
      emailRedirectTo: `${env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
    password: parsed.data.password,
  });

  if (error) {
    // Don't expose internal error details to users
    return { error: "SIGNUP_ERROR" };
  }

  // Email confirmation required (no session yet)
  if (!data.session) {
    return { requiresEmailConfirmation: true, success: true };
  }

  return { success: true };
}
