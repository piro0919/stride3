import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

type TeamPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function TeamPage({
  params,
}: TeamPageProps): Promise<ReactNode> {
  const { slug } = await params;
  const t = await getTranslations("Teams");
  const supabase = await createClient();
  const { data: team } = await supabase
    .from("teams")
    .select(
      `
      id,
      name,
      description,
      created_at,
      team_members (
        id,
        role,
        users (
          display_name
        )
      )
    `,
    )
    .eq("slug", slug)
    .single();

  if (!team) {
    notFound();
  }

  const memberCount = team.team_members?.length || 0;

  return (
    <div>
      <h1 className="mb-2 font-bold text-2xl">{team.name}</h1>
      {team.description && (
        <p className="mb-6 text-muted-foreground">{team.description}</p>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border p-4">
          <p className="text-muted-foreground text-sm">{t("memberCount")}</p>
          <p className="font-semibold text-2xl">{memberCount}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-muted-foreground text-sm">{t("activeSprints")}</p>
          <p className="font-semibold text-2xl">0</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-muted-foreground text-sm">{t("backlogItems")}</p>
          <p className="font-semibold text-2xl">0</p>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="mb-4 font-semibold text-lg">{t("recentActivity")}</h2>
        <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          {t("noActivity")}
        </div>
      </div>
    </div>
  );
}
