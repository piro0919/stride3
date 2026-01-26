"use server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type AcceptInvitationState = {
  error?: string;
};

export async function acceptInvitation(
  token: string,
): Promise<AcceptInvitationState> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("accept_invitation", {
    p_token: token,
  });

  if (error) {
    return { error: error.message };
  }

  const result = data as {
    error?: string;
    success: boolean;
    team_id?: string;
  };

  if (!result.success) {
    return { error: result.error };
  }

  // チームのslugを取得してリダイレクト
  const { data: team } = await supabase
    .from("teams")
    .select("slug")
    .eq("id", result.team_id)
    .single();

  redirect(`/ja/teams/${team?.slug || ""}`);
}
