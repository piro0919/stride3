import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

// Allowed redirect paths to prevent open redirect attacks
const ALLOWED_REDIRECT_PATHS = ["/", "/teams", "/update-password", "/invite"];

function isValidRedirectPath(path: string): boolean {
  if (!path.startsWith("/")) {
    return false;
  }
  // Prevent protocol-relative URLs
  if (path.startsWith("//")) {
    return false;
  }
  return ALLOWED_REDIRECT_PATHS.some(
    (allowed) => path === allowed || path.startsWith(`${allowed}/`),
  );
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { origin, searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  const safeNext = isValidRedirectPath(next) ? next : "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${safeNext}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${safeNext}`);
      }
      return NextResponse.redirect(`${origin}${safeNext}`);
    }
  }

  return NextResponse.redirect(`${origin}/signin?error=auth_callback_error`);
}
