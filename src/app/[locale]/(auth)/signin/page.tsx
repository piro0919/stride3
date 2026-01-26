"use client";
import { SubmitButton } from "../_components/submit-button";
import { signIn, type SignInState } from "./actions";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { type ReactNode, useActionState } from "react";

const initialState: SignInState = {};

export default function SignInPage(): ReactNode {
  const t = useTranslations("Auth");
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");
  const [state, formAction] = useActionState(signIn, initialState);

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center p-4">
      <div className="w-full space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="font-bold text-2xl">{t("signIn")}</h1>
          <p className="text-muted-foreground">{t("signInDescription")}</p>
        </div>
        <form action={formAction} className="space-y-4">
          {redirectTo && (
            <input name="redirect" type="hidden" value={redirectTo} />
          )}
          <div className="space-y-2">
            <label className="font-medium text-sm" htmlFor="email">
              {t("email")}
            </label>
            <Input
              autoComplete="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              required={true}
              type="email"
            />
          </div>
          <div className="space-y-2">
            <label className="font-medium text-sm" htmlFor="password">
              {t("password")}
            </label>
            <Input
              autoComplete="current-password"
              id="password"
              name="password"
              placeholder="••••••••"
              required={true}
              type="password"
            />
          </div>
          {state.error && (
            <p className="text-destructive text-sm">
              {t(`errors.${state.error}`)}
            </p>
          )}
          <SubmitButton>{t("signIn")}</SubmitButton>
          <div className="text-center">
            <Link
              className="text-muted-foreground text-sm hover:text-primary"
              href="/forgot-password"
            >
              {t("forgotPassword")}
            </Link>
          </div>
        </form>
        <p className="text-center text-muted-foreground text-sm">
          {t("dontHaveAccount")}{" "}
          <Link className="text-primary underline" href="/signup">
            {t("signUp")}
          </Link>
        </p>
      </div>
    </div>
  );
}
