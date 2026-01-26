import type { Tables } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/server";
import { User } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

type MembersPageProps = {
  params: Promise<{ slug: string }>;
};

type MemberWithUser = {
  id: string;
  joined_at: string;
  role: Tables<"team_members">["role"];
  users: null | {
    avatar_url: null | string;
    display_name: null | string;
    email: string;
    id: string;
  };
};

export default async function MembersPage({
  params,
}: MembersPageProps): Promise<ReactNode> {
  const { slug } = await params;
  const t = await getTranslations("Teams");
  const supabase = await createClient();
  const { data: team } = await supabase
    .from("teams")
    .select("id")
    .eq("slug", slug)
    .single();

  if (!team) {
    notFound();
  }

  const { data: members } = await supabase
    .from("team_members")
    .select(
      `
      id,
      role,
      joined_at,
      users (
        id,
        display_name,
        email,
        avatar_url
      )
    `,
    )
    .eq("team_id", team.id)
    .order("joined_at", { ascending: true });

  return (
    <div>
      <h1 className="mb-6 font-bold text-2xl">{t("members")}</h1>
      <div className="space-y-2">
        {(members as MemberWithUser[] | null)?.map((member) => {
          const user = member.users;
          if (!user) return null;
          return (
            <div
              className="flex items-center justify-between rounded-lg border p-4"
              key={member.id}
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                  {user.avatar_url ? (
                    <Image
                      alt={user.display_name || ""}
                      className="size-10 rounded-full"
                      height={40}
                      src={user.avatar_url}
                      width={40}
                    />
                  ) : (
                    <User className="size-5 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <p className="font-medium">
                    {user.display_name || user.email}
                  </p>
                  <p className="text-muted-foreground text-sm">{user.email}</p>
                </div>
              </div>
              <span className="rounded-full bg-muted px-3 py-1 text-sm">
                {t(`roles.${member.role}`)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
