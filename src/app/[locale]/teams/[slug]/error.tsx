"use client";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

type ErrorProps = {
  error: Error;
  reset: () => void;
};

export default function TeamError({ reset }: ErrorProps): ReactNode {
  const t = useTranslations("Error");
  const tc = useTranslations("Common");

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h1 className="mb-2 font-bold text-2xl">{t("title")}</h1>
      <p className="mb-6 text-muted-foreground">{t("description")}</p>
      <Button onClick={reset}>{tc("retry")}</Button>
    </div>
  );
}
