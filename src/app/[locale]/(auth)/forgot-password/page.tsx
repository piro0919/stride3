"use client";
import { SubmitButton } from "../_components/submit-button";
import { forgotPassword, type ForgotPasswordState } from "./actions";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { type ReactNode, useActionState } from "react";

const initialState: ForgotPasswordState = {};

export default function ForgotPasswordPage(): ReactNode {
  const t = useTranslations("Auth");
  const [state, formAction] = useActionState(forgotPassword, initialState);

  if (state.success) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center p-4">
        <div className="w-full space-y-6 text-center">
          <h1 className="font-bold text-2xl">{t("checkEmail")}</h1>
          <p className="text-muted-foreground">{t("resetPasswordEmailSent")}</p>
          <Link className="text-primary underline" href="/signin">
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
          <h1 className="font-bold text-2xl">{t("forgotPassword")}</h1>
          <p className="text-muted-foreground">
            {t("forgotPasswordDescription")}
          </p>
        </div>
        <form action={formAction} className="space-y-4">
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
          {state.error && (
            <p className="text-destructive text-sm">
              {t(`errors.${state.error}`)}
            </p>
          )}
          <SubmitButton>{t("sendResetLink")}</SubmitButton>
        </form>
        <p className="text-center text-muted-foreground text-sm">
          <Link className="text-primary underline" href="/signin">
            {t("backToSignIn")}
          </Link>
        </p>
      </div>
    </div>
  );
}
