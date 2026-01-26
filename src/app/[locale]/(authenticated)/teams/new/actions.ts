"use server";
import { createTeamSchema } from "./schema";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type CreateTeamState = {
  error?: string;
  fieldErrors?: {
    description?: string[];
    name?: string[];
    slug?: string[];
  };
};

export async function createTeam(
  _prevState: CreateTeamState,
  formData: FormData,
): Promise<CreateTeamState> {
  const parsed = createTeamSchema.safeParse({
    description: formData.get("description") || undefined,
    name: formData.get("name"),
    slug: formData.get("slug"),
  });

  if (!parsed.success) {
    return {
      error: "VALIDATION_ERROR",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("create_team_with_owner", {
    p_description: parsed.data.description,
    p_name: parsed.data.name,
    p_slug: parsed.data.slug,
  });

  if (error) {
    return { error: error.message };
  }

  const result = data as {
    error?: string;
    slug?: string;
    success: boolean;
    team_id?: string;
  };

  if (!result.success) {
    if (result.error === "SLUG_ALREADY_EXISTS") {
      return {
        error: "SLUG_ALREADY_EXISTS",
        fieldErrors: { slug: ["SLUG_ALREADY_EXISTS"] },
      };
    }
    return { error: result.error };
  }

  redirect(`/ja/teams/${result.slug}`);
}
