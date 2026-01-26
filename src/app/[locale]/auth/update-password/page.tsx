"use client";
import { SubmitButton } from "../_components/submit-button";
import { updatePassword, type UpdatePasswordState } from "./actions";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { type ReactNode, useActionState } from "react";

const initialState: UpdatePasswordState = {};

export default function UpdatePasswordPage(): ReactNode {
  const t = useTranslations("Auth");
  const [state, formAction] = useActionState(updatePassword, initialState);

  if (state.success) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center p-4">
        <div className="w-full space-y-6 text-center">
          <h1 className="font-bold text-2xl">{t("passwordUpdated")}</h1>
          <p className="text-muted-foreground">
            {t("passwordUpdatedDescription")}
          </p>
          <Link className="text-primary underline" href="/auth/signin">
            {t("signIn")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center p-4">
      <div className="w-full space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="font-bold text-2xl">{t("updatePassword")}</h1>
          <p className="text-muted-foreground">
            {t("updatePasswordDescription")}
          </p>
        </div>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <label className="font-medium text-sm" htmlFor="password">
              {t("newPassword")}
            </label>
            <Input
              autoComplete="new-password"
              id="password"
              minLength={8}
              name="password"
              placeholder="••••••••"
              required={true}
              type="password"
            />
          </div>
          <div className="space-y-2">
            <label className="font-medium text-sm" htmlFor="confirmPassword">
              {t("confirmPassword")}
            </label>
            <Input
              autoComplete="new-password"
              id="confirmPassword"
              minLength={8}
              name="confirmPassword"
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
          <SubmitButton>{t("updatePassword")}</SubmitButton>
        </form>
      </div>
    </div>
  );
}
