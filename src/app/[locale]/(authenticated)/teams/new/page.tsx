"use client";
import { createTeam, type CreateTeamState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { type ReactNode, useActionState, useState } from "react";

const initialState: CreateTeamState = {};

export default function NewTeamPage(): ReactNode {
  const t = useTranslations("Teams");
  const [state, formAction, isPending] = useActionState(
    createTeam,
    initialState,
  );
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const generateSlug = (value: string): string => {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 50);
  };
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setName(value);
    if (!slug || slug === generateSlug(name)) {
      setSlug(generateSlug(value));
    }
  };

  return (
    <div className="container mx-auto max-w-xl p-6">
      <Link
        className="mb-6 inline-flex items-center text-muted-foreground text-sm hover:text-foreground"
        href="/teams"
      >
        <ArrowLeft className="mr-2 size-4" />
        {t("backToTeams")}
      </Link>
      <h1 className="mb-8 font-bold text-2xl">{t("createTeam")}</h1>
      <form action={formAction} className="space-y-6">
        <div className="space-y-2">
          <label className="font-medium text-sm" htmlFor="name">
            {t("teamName")}
          </label>
          <Input
            id="name"
            name="name"
            onChange={handleNameChange}
            placeholder={t("teamNamePlaceholder")}
            required={true}
            type="text"
            value={name}
          />
          {state.fieldErrors?.name && (
            <p className="text-destructive text-sm">
              {t(`errors.${state.fieldErrors.name[0]}`)}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label className="font-medium text-sm" htmlFor="slug">
            {t("teamSlug")}
          </label>
          <Input
            id="slug"
            name="slug"
            onChange={(e) => setSlug(e.target.value)}
            pattern="^[a-z0-9-]+$"
            placeholder="my-team"
            required={true}
            type="text"
            value={slug}
          />
          <p className="text-muted-foreground text-xs">
            {t("slugDescription")}
          </p>
          {state.fieldErrors?.slug && (
            <p className="text-destructive text-sm">
              {t(`errors.${state.fieldErrors.slug[0]}`)}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label className="font-medium text-sm" htmlFor="description">
            {t("teamDescription")}
            <span className="ml-1 text-muted-foreground">
              ({t("optional")})
            </span>
          </label>
          <Input
            id="description"
            name="description"
            placeholder={t("teamDescriptionPlaceholder")}
            type="text"
          />
        </div>
        {state.error && !state.fieldErrors && (
          <p className="text-destructive text-sm">
            {t(`errors.${state.error}`)}
          </p>
        )}
        <Button className="w-full" disabled={isPending} type="submit">
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            t("createTeam")
          )}
        </Button>
      </form>
    </div>
  );
}
