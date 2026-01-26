import { routing } from "./i18n/routing";
import { env } from "@/env";
import { updateSession } from "@/lib/supabase/middleware";
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import createIntlMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";

const intlMiddleware = createIntlMiddleware(routing);
// 認証不要なパス
const PUBLIC_PATHS = [
  "/signin",
  "/signup",
  "/callback",
  "/forgot-password",
  "/update-password",
];

function isPublicPath(pathname: string): boolean {
  const pathWithoutLocale = pathname.replace(/^\/(ja|en)/, "") || "/";
  return (
    pathWithoutLocale === "/" ||
    PUBLIC_PATHS.some((path) => pathWithoutLocale.startsWith(path))
  );
}

export default async function proxy(request: NextRequest): Promise<Response> {
  // Supabaseセッションの更新
  const supabaseResponse = await updateSession(request);
  // i18nミドルウェアを適用
  const intlResponse = intlMiddleware(request);

  // Supabaseのクッキーをi18nレスポンスにマージ
  for (const cookie of supabaseResponse.cookies.getAll()) {
    intlResponse.cookies.set(cookie.name, cookie.value, cookie);
  }

  // 認証チェック（保護されたルートへのアクセス）
  const pathname = request.nextUrl.pathname;

  if (!isPublicPath(pathname)) {
    const {
      data: { user },
    } = await createSupabaseClient(request).auth.getUser();

    if (!user) {
      const locale = pathname.match(/^\/(ja|en)/)?.[1] || "ja";
      const redirectUrl = new URL(`/${locale}/signin`, request.url);
      redirectUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return intlResponse;
}

// ミドルウェア用の簡易クライアント作成
function createSupabaseClient(request: NextRequest): SupabaseClient {
  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll(): { name: string; value: string }[] {
          return request.cookies.getAll();
        },
        setAll(): void {
          // 読み取り専用
        },
      },
    },
  );
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
