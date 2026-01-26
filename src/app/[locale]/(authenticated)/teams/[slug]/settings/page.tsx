import { Link } from "@/i18n/navigation";
import { Mail, Settings } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

type SettingsPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function SettingsPage({
  params,
}: SettingsPageProps): Promise<ReactNode> {
  const { slug } = await params;
  const t = await getTranslations("Teams");

  return (
    <div>
      <h1 className="mb-6 font-bold text-2xl">{t("settings")}</h1>
      <div className="space-y-2">
        <Link
          className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-muted"
          href={`/teams/${slug}/settings/invitations`}
        >
          <Mail className="size-5" />
          <div>
            <p className="font-medium">{t("invitations")}</p>
            <p className="text-muted-foreground text-sm">
              {t("invitationsDescription")}
            </p>
          </div>
        </Link>
        <div className="flex cursor-not-allowed items-center gap-3 rounded-lg border p-4 opacity-50">
          <Settings className="size-5" />
          <div>
            <p className="font-medium">{t("teamSettings")}</p>
            <p className="text-muted-foreground text-sm">
              {t("teamSettingsDescription")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
