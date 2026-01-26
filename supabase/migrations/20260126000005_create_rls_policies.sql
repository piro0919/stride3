-- RLSを有効化
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_invitations ENABLE ROW LEVEL SECURITY;

-- ==================== users テーブルのポリシー ====================

-- 自分のプロフィールは参照可能
CREATE POLICY "users_select_own"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- 同じチームのメンバーのプロフィールは参照可能
CREATE POLICY "users_select_team_members"
  ON public.users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.team_members tm1
      JOIN public.team_members tm2 ON tm1.team_id = tm2.team_id
      WHERE tm1.user_id = auth.uid()
        AND tm2.user_id = users.id
    )
  );

-- 自分のプロフィールのみ更新可能
CREATE POLICY "users_update_own"
  ON public.users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ==================== teams テーブルのポリシー ====================

-- チームメンバーのみチーム情報を参照可能
CREATE POLICY "teams_select_member"
  ON public.teams FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_id = teams.id
        AND user_id = auth.uid()
    )
  );

-- 認証済みユーザーはチームを作成可能
CREATE POLICY "teams_insert_authenticated"
  ON public.teams FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- ownerのみチーム情報を更新可能
CREATE POLICY "teams_update_owner"
  ON public.teams FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_id = teams.id
        AND user_id = auth.uid()
        AND role = 'owner'
    )
  );

-- ownerのみチームを削除可能
CREATE POLICY "teams_delete_owner"
  ON public.teams FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_id = teams.id
        AND user_id = auth.uid()
        AND role = 'owner'
    )
  );

-- ==================== team_members テーブルのポリシー ====================

-- チームメンバーのみメンバー一覧を参照可能
CREATE POLICY "team_members_select_member"
  ON public.team_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.team_members tm
      WHERE tm.team_id = team_members.team_id
        AND tm.user_id = auth.uid()
    )
  );

-- owner/scrum_masterのみメンバーを追加可能、またはチーム作成時に自分をownerとして追加
CREATE POLICY "team_members_insert_admin"
  ON public.team_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_id = team_members.team_id
        AND user_id = auth.uid()
        AND role IN ('owner', 'scrum_master')
    )
    OR (
      EXISTS (
        SELECT 1 FROM public.teams
        WHERE id = team_members.team_id
          AND created_by = auth.uid()
      )
      AND team_members.user_id = auth.uid()
      AND team_members.role = 'owner'
    )
  );

-- owner/scrum_masterのみメンバーのロールを更新可能（自分以外）
CREATE POLICY "team_members_update_admin"
  ON public.team_members FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.team_members tm
      WHERE tm.team_id = team_members.team_id
        AND tm.user_id = auth.uid()
        AND tm.role IN ('owner', 'scrum_master')
    )
    AND team_members.user_id != auth.uid()
  );

-- ownerのみメンバーを削除可能、またはメンバーが自分で退出（ownerは退出不可）
CREATE POLICY "team_members_delete"
  ON public.team_members FOR DELETE
  USING (
    (team_members.user_id = auth.uid() AND team_members.role != 'owner')
    OR (
      EXISTS (
        SELECT 1 FROM public.team_members tm
        WHERE tm.team_id = team_members.team_id
          AND tm.user_id = auth.uid()
          AND tm.role = 'owner'
      )
      AND team_members.user_id != auth.uid()
    )
  );

-- ==================== team_invitations テーブルのポリシー ====================

-- owner/scrum_masterのみ招待一覧を参照可能
CREATE POLICY "team_invitations_select_admin"
  ON public.team_invitations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_id = team_invitations.team_id
        AND user_id = auth.uid()
        AND role IN ('owner', 'scrum_master')
    )
  );

-- 自分宛ての招待は参照可能
CREATE POLICY "team_invitations_select_own_email"
  ON public.team_invitations FOR SELECT
  USING (
    email = (SELECT email FROM public.users WHERE id = auth.uid())
  );

-- owner/scrum_masterのみ招待を作成可能
CREATE POLICY "team_invitations_insert_admin"
  ON public.team_invitations FOR INSERT
  WITH CHECK (
    auth.uid() = invited_by
    AND EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_id = team_invitations.team_id
        AND user_id = auth.uid()
        AND role IN ('owner', 'scrum_master')
    )
  );

-- owner/scrum_masterのみ招待をキャンセル（更新）可能
CREATE POLICY "team_invitations_update_admin"
  ON public.team_invitations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_id = team_invitations.team_id
        AND user_id = auth.uid()
        AND role IN ('owner', 'scrum_master')
    )
  );
