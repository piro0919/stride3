"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(["scrum_master", "developer"]),
  teamId: z.string().uuid(),
});

export type InviteState = {
  error?: string;
  inviteUrl?: string;
  success?: boolean;
};

export async function createInvitation(
  _prevState: InviteState,
  formData: FormData,
): Promise<InviteState> {
  const parsed = inviteSchema.safeParse({
    email: formData.get("email"),
    role: formData.get("role"),
    teamId: formData.get("teamId"),
  });

  if (!parsed.success) {
    return { error: "VALIDATION_ERROR" };
  }

  const supabase = await createClient();
  // 既存の招待を確認
  const { data: existingInvite } = await supabase
    .from("team_invitations")
    .select("id")
    .eq("team_id", parsed.data.teamId)
    .eq("email", parsed.data.email)
    .eq("status", "pending")
    .single();

  if (existingInvite) {
    return { error: "ALREADY_INVITED" };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "NOT_AUTHENTICATED" };
  }

  // 招待を作成
  const { data: invitation, error } = await supabase
    .from("team_invitations")
    .insert({
      email: parsed.data.email,
      invited_by: user.id,
      role: parsed.data.role,
      team_id: parsed.data.teamId,
    })
    .select("token")
    .single();

  if (error) {
    return { error: error.message };
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const inviteUrl = `${baseUrl}/ja/invite/${invitation.token}`;

  revalidatePath("/teams");

  return { inviteUrl, success: true };
}

export async function cancelInvitation(
  invitationId: string,
  teamSlug: string,
): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("team_invitations")
    .update({ status: "cancelled" })
    .eq("id", invitationId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/teams/${teamSlug}/settings/invitations`);

  return { success: true };
}
