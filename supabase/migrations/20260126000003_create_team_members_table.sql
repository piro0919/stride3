-- ロールのENUM型
CREATE TYPE public.team_role AS ENUM ('owner', 'scrum_master', 'developer');

-- team_membersテーブル（中間テーブル、ロール含む）
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role public.team_role NOT NULL DEFAULT 'developer',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- インデックス
CREATE INDEX team_members_team_id_idx ON public.team_members(team_id);
CREATE INDEX team_members_user_id_idx ON public.team_members(user_id);
CREATE INDEX team_members_role_idx ON public.team_members(role);
