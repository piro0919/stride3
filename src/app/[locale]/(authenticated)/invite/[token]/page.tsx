import { AcceptInvitationButton } from "./_components/accept-button";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

type InvitePageProps = {
  params: Promise<{ token: string }>;
};

export default async function InvitePage({
  params,
}: InvitePageProps): Promise<ReactNode> {
  const { token } = await params;
  const t = await getTranslations("Invite");
  const supabase = await createClient();
  // 招待情報を取得
  const { data: invitation } = await supabase
    .from("team_invitations")
    .select(
      `
      id,
      email,
      role,
      status,
      expires_at,
      teams (
        id,
        name,
        slug
      )
    `,
    )
    .eq("token", token)
    .single();

  if (!invitation) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className="mb-2 font-bold text-2xl">{t("notFound")}</h1>
        <p className="mb-6 text-muted-foreground">{t("notFoundDescription")}</p>
        <Button asChild={true}>
          <Link href="/signin">{t("goToSignIn")}</Link>
        </Button>
      </div>
    );
  }

  if (invitation.status !== "pending") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className="mb-2 font-bold text-2xl">{t("alreadyUsed")}</h1>
        <p className="mb-6 text-muted-foreground">
          {t("alreadyUsedDescription")}
        </p>
        <Button asChild={true}>
          <Link href="/teams">{t("goToTeams")}</Link>
        </Button>
      </div>
    );
  }

  if (new Date(invitation.expires_at) < new Date()) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className="mb-2 font-bold text-2xl">{t("expired")}</h1>
        <p className="mb-6 text-muted-foreground">{t("expiredDescription")}</p>
        <Button asChild={true}>
          <Link href="/signin">{t("goToSignIn")}</Link>
        </Button>
      </div>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const team = invitation.teams as { id: string; name: string; slug: string };

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className="mb-2 font-bold text-2xl">{t("title")}</h1>
        <p className="mb-2 text-muted-foreground">
          {t("invitedTo", { team: team.name })}
        </p>
        <p className="mb-6 text-muted-foreground">{t("signInRequired")}</p>
        <div className="flex gap-4">
          <Button asChild={true} variant="outline">
            <Link href={`/signin?redirect=/invite/${token}`}>
              {t("signIn")}
            </Link>
          </Button>
          <Button asChild={true}>
            <Link href={`/signup?redirect=/invite/${token}`}>
              {t("signUp")}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (user.email !== invitation.email) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className="mb-2 font-bold text-2xl">{t("wrongAccount")}</h1>
        <p className="mb-6 text-center text-muted-foreground">
          {t("wrongAccountDescription", { email: invitation.email })}
        </p>
        <Button asChild={true}>
          <Link href="/signin">{t("signInWithCorrectAccount")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="mb-2 font-bold text-2xl">{t("title")}</h1>
      <p className="mb-6 text-muted-foreground">
        {t("invitedTo", { team: team.name })}
      </p>
      <AcceptInvitationButton token={token} />
    </div>
  );
}
