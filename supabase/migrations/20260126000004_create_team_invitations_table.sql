-- 招待ステータスのENUM型
CREATE TYPE public.invitation_status AS ENUM ('pending', 'accepted', 'expired', 'cancelled');

-- team_invitationsテーブル
CREATE TABLE public.team_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role public.team_role NOT NULL DEFAULT 'developer',
  token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  status public.invitation_status NOT NULL DEFAULT 'pending',
  invited_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  accepted_at TIMESTAMPTZ
);

-- インデックス
CREATE INDEX team_invitations_team_id_idx ON public.team_invitations(team_id);
CREATE INDEX team_invitations_email_idx ON public.team_invitations(email);
CREATE UNIQUE INDEX team_invitations_token_idx ON public.team_invitations(token);
CREATE INDEX team_invitations_status_idx ON public.team_invitations(status);
