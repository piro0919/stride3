import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { LayoutDashboard, Settings, Users } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

type TeamLayoutProps = {
  children: ReactNode;
  params: Promise<{ slug: string }>;
};

export default async function TeamLayout({
  children,
  params,
}: TeamLayoutProps): Promise<ReactNode> {
  const { slug } = await params;
  const t = await getTranslations("Teams");
  const supabase = await createClient();
  const { data: team } = await supabase
    .from("teams")
    .select("id, name, slug")
    .eq("slug", slug)
    .single();

  if (!team) {
    notFound();
  }

  const { data: membership } = await supabase
    .from("team_members")
    .select("role")
    .eq("team_id", team.id)
    .single();

  if (!membership) {
    notFound();
  }

  const isAdmin =
    membership.role === "owner" || membership.role === "scrum_master";

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-muted/30 p-4">
        <div className="mb-6">
          <Link
            className="text-muted-foreground text-xs hover:text-foreground"
            href="/teams"
          >
            {t("allTeams")}
          </Link>
          <h2 className="mt-1 font-semibold text-lg">{team.name}</h2>
        </div>
        <nav className="space-y-1">
          <Link
            className="flex items-center rounded-md px-3 py-2 text-sm hover:bg-muted"
            href={`/teams/${slug}`}
          >
            <LayoutDashboard className="mr-3 size-4" />
            {t("dashboard")}
          </Link>
          <Link
            className="flex items-center rounded-md px-3 py-2 text-sm hover:bg-muted"
            href={`/teams/${slug}/members`}
          >
            <Users className="mr-3 size-4" />
            {t("members")}
          </Link>
          {isAdmin && (
            <Link
              className="flex items-center rounded-md px-3 py-2 text-sm hover:bg-muted"
              href={`/teams/${slug}/settings`}
            >
              <Settings className="mr-3 size-4" />
              {t("settings")}
            </Link>
          )}
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
