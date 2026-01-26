import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import type { Tables } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/server";
import { Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

type TeamMemberWithTeam = {
  role: Tables<"team_members">["role"];
  team_id: string;
  teams: null | {
    description: null | string;
    id: string;
    name: string;
    slug: string;
  };
};

export default async function TeamsPage(): Promise<ReactNode> {
  const t = await getTranslations("Teams");
  const supabase = await createClient();
  const { data: teams } = await supabase
    .from("team_members")
    .select(
      `
      team_id,
      role,
      teams (
        id,
        name,
        slug,
        description
      )
    `,
    )
    .order("joined_at", { ascending: false });

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-bold text-2xl">{t("title")}</h1>
        <Button asChild={true}>
          <Link href="/teams/new">
            <Plus className="mr-2 size-4" />
            {t("createTeam")}
          </Link>
        </Button>
      </div>
      {teams && teams.length > 0 ? (
        <div className="grid gap-4">
          {(teams as TeamMemberWithTeam[]).map((member) => {
            const team = member.teams as {
              description: null | string;
              id: string;
              name: string;
              slug: string;
            };
            return (
              <Link
                className="block rounded-lg border p-4 transition-colors hover:bg-muted"
                href={`/teams/${team.slug}`}
                key={team.id}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-lg">{team.name}</h2>
                    {team.description && (
                      <p className="mt-1 text-muted-foreground text-sm">
                        {team.description}
                      </p>
                    )}
                  </div>
                  <span className="rounded-full bg-muted px-2 py-1 text-muted-foreground text-xs">
                    {t(`roles.${member.role}`)}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">{t("noTeams")}</p>
          <Button asChild={true} className="mt-4">
            <Link href="/teams/new">
              <Plus className="mr-2 size-4" />
              {t("createFirstTeam")}
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
