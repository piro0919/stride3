import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

export default async function TeamNotFound(): Promise<ReactNode> {
  const t = await getTranslations("Teams");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="mb-2 font-bold text-2xl">{t("teamNotFound")}</h1>
      <p className="mb-6 text-muted-foreground">
        {t("teamNotFoundDescription")}
      </p>
      <Button asChild={true}>
        <Link href="/teams">{t("backToTeams")}</Link>
      </Button>
    </div>
  );
}
