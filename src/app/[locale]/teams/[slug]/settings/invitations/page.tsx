"use client";
import { createInvitation, type InviteState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, Check, Copy, Loader2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { type ReactNode, useActionState, useEffect, useState } from "react";

const initialState: InviteState = {};

export default function InvitationsPage(): ReactNode {
  const t = useTranslations("Teams");
  const params = useParams();
  const slug = params.slug as string;
  const [state, formAction, isPending] = useActionState(
    createInvitation,
    initialState,
  );
  const [copied, setCopied] = useState(false);
  const [teamId, setTeamId] = useState<null | string>(null);

  useEffect(() => {
    const fetchTeamId = async (): Promise<void> => {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data } = await supabase
        .from("teams")
        .select("id")
        .eq("slug", slug)
        .single();
      if (data) {
        setTeamId(data.id);
      }
    };
    fetchTeamId();
  }, [slug]);

  const handleCopy = async (): Promise<void> => {
    if (state.inviteUrl) {
      await navigator.clipboard.writeText(state.inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div>
      <Link
        className="mb-4 inline-flex items-center text-muted-foreground text-sm hover:text-foreground"
        href={`/teams/${slug}/settings`}
      >
        <ArrowLeft className="mr-2 size-4" />
        {t("backToSettings")}
      </Link>
      <h1 className="mb-6 font-bold text-2xl">{t("invitations")}</h1>
      <div className="rounded-lg border p-6">
        <h2 className="mb-4 font-semibold">{t("inviteMember")}</h2>
        {state.success && state.inviteUrl ? (
          <div className="space-y-4">
            <div className="rounded-lg bg-green-50 p-4 text-green-800 dark:bg-green-900/20 dark:text-green-200">
              <p className="flex items-center gap-2">
                <Check className="size-4" />
                {t("invitationCreated")}
              </p>
            </div>
            <div className="flex gap-2">
              <Input readOnly={true} value={state.inviteUrl} />
              <Button onClick={handleCopy} variant="outline">
                {copied ? (
                  <Check className="size-4" />
                ) : (
                  <Copy className="size-4" />
                )}
              </Button>
            </div>
            <Button onClick={() => window.location.reload()} variant="outline">
              {t("inviteAnother")}
            </Button>
          </div>
        ) : (
          <form action={formAction} className="space-y-4">
            {teamId && <input name="teamId" type="hidden" value={teamId} />}
            <div className="space-y-2">
              <label className="font-medium text-sm" htmlFor="email">
                {t("emailAddress")}
              </label>
              <Input
                id="email"
                name="email"
                placeholder="member@example.com"
                required={true}
                type="email"
              />
            </div>
            <div className="space-y-2">
              <label className="font-medium text-sm" htmlFor="role">
                {t("role")}
              </label>
              <select
                className="w-full rounded-md border bg-background px-3 py-2"
                defaultValue="developer"
                id="role"
                name="role"
              >
                <option value="developer">{t("roles.developer")}</option>
                <option value="scrum_master">{t("roles.scrum_master")}</option>
              </select>
            </div>
            {state.error && (
              <p className="flex items-center gap-2 text-destructive text-sm">
                <X className="size-4" />
                {t(`inviteErrors.${state.error}`)}
              </p>
            )}
            <Button disabled={isPending || !teamId} type="submit">
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                t("createInvitation")
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
