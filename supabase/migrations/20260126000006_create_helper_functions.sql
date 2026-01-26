-- ユーザーがチームのメンバーかどうかを確認する関数
CREATE OR REPLACE FUNCTION public.is_team_member(p_team_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.team_members
    WHERE team_id = p_team_id
      AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ユーザーのチームにおけるロールを取得する関数
CREATE OR REPLACE FUNCTION public.get_team_role(p_team_id UUID)
RETURNS public.team_role AS $$
DECLARE
  v_role public.team_role;
BEGIN
  SELECT role INTO v_role
  FROM public.team_members
  WHERE team_id = p_team_id
    AND user_id = auth.uid();
  RETURN v_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 招待を受諾する関数（トランザクションで処理）
CREATE OR REPLACE FUNCTION public.accept_invitation(p_token TEXT)
RETURNS JSON AS $$
DECLARE
  v_invitation RECORD;
  v_user_id UUID;
  v_existing_member RECORD;
BEGIN
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'NOT_AUTHENTICATED');
  END IF;

  -- 招待を取得
  SELECT * INTO v_invitation
  FROM public.team_invitations
  WHERE token = p_token
    AND status = 'pending'
    AND expires_at > NOW();

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'INVITATION_NOT_FOUND');
  END IF;

  -- メールアドレスが一致するか確認
  IF v_invitation.email != (SELECT email FROM public.users WHERE id = v_user_id) THEN
    RETURN json_build_object('success', false, 'error', 'EMAIL_MISMATCH');
  END IF;

  -- 既にチームメンバーか確認
  SELECT * INTO v_existing_member
  FROM public.team_members
  WHERE team_id = v_invitation.team_id
    AND user_id = v_user_id;

  IF FOUND THEN
    RETURN json_build_object('success', false, 'error', 'ALREADY_MEMBER');
  END IF;

  -- メンバーとして追加
  INSERT INTO public.team_members (team_id, user_id, role)
  VALUES (v_invitation.team_id, v_user_id, v_invitation.role);

  -- 招待ステータスを更新
  UPDATE public.team_invitations
  SET status = 'accepted', accepted_at = NOW()
  WHERE id = v_invitation.id;

  RETURN json_build_object(
    'success', true,
    'team_id', v_invitation.team_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- チームを作成する関数（チーム作成と同時にownerとして追加）
CREATE OR REPLACE FUNCTION public.create_team_with_owner(
  p_name TEXT,
  p_slug TEXT,
  p_description TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  v_team_id UUID;
  v_user_id UUID;
BEGIN
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'NOT_AUTHENTICATED');
  END IF;

  -- slugの重複チェック
  IF EXISTS (SELECT 1 FROM public.teams WHERE slug = p_slug) THEN
    RETURN json_build_object('success', false, 'error', 'SLUG_ALREADY_EXISTS');
  END IF;

  -- チームを作成
  INSERT INTO public.teams (name, slug, description, created_by)
  VALUES (p_name, p_slug, p_description, v_user_id)
  RETURNING id INTO v_team_id;

  -- 作成者をownerとして追加
  INSERT INTO public.team_members (team_id, user_id, role)
  VALUES (v_team_id, v_user_id, 'owner');

  RETURN json_build_object(
    'success', true,
    'team_id', v_team_id,
    'slug', p_slug
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
