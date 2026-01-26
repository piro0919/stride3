"use server";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { z } from "zod";

export type UpdatePasswordState = {
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

const passwordSchema = z.string().min(8);

export async function updatePassword(
  _prevState: UpdatePasswordState,
  formData: FormData,
): Promise<UpdatePasswordState> {
  const ip = await getClientIp();
  const rateLimitResult = checkRateLimit(
    getRateLimitKey(ip, "updatePassword"),
    {
      maxAttempts: 5,
      windowMs: 300000, // 5 minutes
    },
  );

  if (!rateLimitResult.success) {
    return { error: "TOO_MANY_ATTEMPTS" };
  }

  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  if (typeof password !== "string" || typeof confirmPassword !== "string") {
    return { error: "VALIDATION_ERROR" };
  }

  if (password !== confirmPassword) {
    return { error: "PASSWORD_MISMATCH" };
  }

  const parsed = passwordSchema.safeParse(password);
  if (!parsed.success) {
    return { error: "PASSWORD_TOO_SHORT" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data });

  if (error) {
    return { error: "UPDATE_PASSWORD_ERROR" };
  }

  return { success: true };
}
