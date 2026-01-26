"use server";
import { env } from "@/env";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { z } from "zod";

export type ForgotPasswordState = {
  error?: string;
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

const emailSchema = z.string().email();

export async function forgotPassword(
  _prevState: ForgotPasswordState,
  formData: FormData,
): Promise<ForgotPasswordState> {
  const ip = await getClientIp();
  const rateLimitResult = checkRateLimit(
    getRateLimitKey(ip, "forgotPassword"),
    {
      maxAttempts: 3,
      windowMs: 300000, // 5 minutes
    },
  );

  if (!rateLimitResult.success) {
    return { error: "TOO_MANY_ATTEMPTS" };
  }

  const email = formData.get("email");
  if (typeof email !== "string") {
    return { error: "VALIDATION_ERROR" };
  }

  const parsed = emailSchema.safeParse(email);
  if (!parsed.success) {
    return { error: "VALIDATION_ERROR" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
    redirectTo: `${env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/auth/update-password`,
  });

  if (error) {
    // Always return success to prevent email enumeration
    return { success: true };
  }

  return { success: true };
}
