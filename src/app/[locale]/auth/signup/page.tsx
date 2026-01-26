"use client";
import { SubmitButton } from "../_components/submit-button";
import { signUp, type SignUpState } from "./actions";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { type ReactNode, useActionState } from "react";

const initialState: SignUpState = {};

export default function SignUpPage(): ReactNode {
  const t = useTranslations("Auth");
  const [state, formAction] = useActionState(signUp, initialState);

  if (state.success) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center p-4">
        <div className="w-full space-y-6 text-center">
          <h1 className="font-bold text-2xl">{t("checkEmail")}</h1>
          <p className="text-muted-foreground">{t("checkEmailDescription")}</p>
          <Link className="text-primary underline" href="/auth/signin">
            {t("backToSignIn")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center p-4">
      <div className="w-full space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="font-bold text-2xl">{t("signUp")}</h1>
          <p className="text-muted-foreground">{t("signUpDescription")}</p>
        </div>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <label className="font-medium text-sm" htmlFor="displayName">
              {t("displayName")}
            </label>
            <Input
              autoComplete="name"
              id="displayName"
              name="displayName"
              placeholder={t("displayNamePlaceholder")}
              required={true}
              type="text"
            />
          </div>
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
              autoComplete="new-password"
              id="password"
              minLength={6}
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
          <SubmitButton>{t("signUp")}</SubmitButton>
        </form>
        <p className="text-center text-muted-foreground text-sm">
          {t("alreadyHaveAccount")}{" "}
          <Link className="text-primary underline" href="/auth/signin">
            {t("signIn")}
          </Link>
        </p>
      </div>
    </div>
  );
}
