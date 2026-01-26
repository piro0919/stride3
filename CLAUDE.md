# CLAUDE.md

このファイルはClaude Codeがこのリポジトリで作業する際のガイドラインです。

## プロジェクト概要

- **フレームワーク**: Next.js 16 (App Router, Turbopack)
- **UI**: Tailwind CSS v4
- **言語**: TypeScript (strict mode)
- **i18n**: next-intl（日本語/英語、デフォルト: 日本語）
- **バックエンド**: Supabase (Auth, PostgreSQL)
- **環境変数**: @t3-oss/env-nextjs
- **PWA**: Serwist（Service Worker, オフライン対応）

## 開発コマンド

```bash
pnpm dev          # 開発サーバー起動
pnpm build        # プロダクションビルド
pnpm start        # プロダクションサーバー起動
pnpm lint         # ESLint によるリント
pnpm lint:fix     # ESLint による自動修正
pnpm format       # Prettier によるフォーマット
pnpm typecheck    # TypeScript 型チェック
pnpm secretlint   # シークレット検出

# Supabase
pnpm db:start     # Supabaseローカル起動（Docker Desktop必要）
pnpm db:stop      # Supabaseローカル停止
pnpm db:reset     # DBリセット＋シード投入
pnpm db:types     # 型定義生成
```

## Supabase ローカル環境

### ポート設定

| サービス  | ポート |
| --------- | ------ |
| API       | 57321  |
| DB        | 57322  |
| Studio    | 57323  |
| Inbucket  | 57324  |
| Analytics | 57327  |

### セットアップ

```bash
# Docker Desktop起動後
pnpm db:start

# 環境変数を設定（.env.localにコピー）
# supabase startの出力からAPI URLとanon keyを取得
```

### Supabase Studio

- URL: http://localhost:57323
- ユーザー作成・データ確認はここで行う

## ディレクトリ構成

```
src/
├── app/
│   ├── manifest.ts       # PWAマニフェスト
│   ├── sw.ts             # Service Worker
│   ├── serwist/[path]/   # Serwist ルート
│   ├── ~offline/         # オフラインページ
│   └── [locale]/         # ロケールベースルーティング
│       ├── _components/      # レイアウト用コンポーネント
│       │   └── serwist-provider.tsx
│       ├── layout.tsx    # ルートレイアウト
│       ├── page.tsx      # トップページ
│       ├── globals.css   # グローバルCSS
│       └── [feature]/    # 機能別ディレクトリ
│           ├── _components/  # ページ固有コンポーネント
│           ├── actions.ts    # Server Actions
│           ├── schema.ts     # Zodスキーマ・型定義
│           └── page.tsx      # ページコンポーネント
├── components/           # 共通コンポーネント
│   └── ui/               # shadcn/ui (自動生成、編集禁止)
├── env.ts                # 環境変数定義（型安全）
├── i18n/                 # 国際化設定
│   ├── routing.ts        # ルーティング設定
│   ├── request.ts        # リクエスト設定
│   └── navigation.ts     # ナビゲーションヘルパー
├── lib/
│   └── supabase/         # Supabaseクライアント
│       ├── client.ts     # ブラウザ用クライアント
│       ├── server.ts     # サーバー用クライアント
│       └── middleware.ts # ミドルウェア用
└── proxy.ts              # ミドルウェア（i18n）

messages/                 # 翻訳ファイル
├── ja.json               # 日本語
└── en.json               # 英語

supabase/                 # Supabase設定
├── config.toml           # ローカル設定
├── migrations/           # マイグレーション
└── seed.sql              # シードデータ
```

## Supabase クライアント

### サーバーコンポーネント / Server Actions

```typescript
import { createClient } from "@/lib/supabase/server";

const supabase = await createClient();
const { data } = await supabase.from("table").select();
```

### クライアントコンポーネント

```typescript
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();
```

### 環境変数

`.env.local` に以下を設定:

```bash
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:57321
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

## 国際化 (i18n)

### 翻訳の使用

サーバーコンポーネント:

```typescript
import { getTranslations } from "next-intl/server";

const t = await getTranslations("Namespace");
t("key");
```

クライアントコンポーネント:

```typescript
import { useTranslations } from "next-intl";

const t = useTranslations("Namespace");
t("key");
```

### ナビゲーション

next-intl のナビゲーションを使用:

```typescript
import { Link, redirect, usePathname, useRouter } from "@/i18n/navigation";
```

### 翻訳ファイル

- `messages/ja.json` - 日本語
- `messages/en.json` - 英語
- 新しい翻訳キーを追加する際は、両方のファイルを更新すること

## コーディング規約

### 命名規則

- **ファイル名**: kebab-case または PascalCase（コンポーネント）
- **変数・関数**: camelCase
- **型・インターフェース**: PascalCase（`type` を使用、`interface` は使わない）
- **定数**: UPPER_SNAKE_CASE

### コンポーネント

- Props型は `ComponentNameProps` 形式で定義
- `src/components/ui/` は shadcn/ui で生成するため直接編集しない
- ページ固有のコンポーネントは `_components/` に配置

### インポート

- `@/` エイリアスを使用（`src/` を指す）
- 型のみのインポートは `import type` または inline type imports を使用
- インポートは自動でアルファベット順にソートされる（perfectionist）

### 関数

- 関数には明示的な戻り値の型を指定する（`explicit-function-return-type`）
- `_` で始まる引数は未使用として許容される

## PWA (Progressive Web App)

### 構成ファイル

- `src/app/manifest.ts` - PWAマニフェスト
- `src/app/sw.ts` - Service Worker
- `src/app/serwist/[path]/route.ts` - Serwist ルート
- `src/app/~offline/page.tsx` - オフラインページ
- `src/app/[locale]/_components/serwist-provider.tsx` - SerwistProvider
- `public/icon-192.svg`, `public/icon-512.svg` - PWAアイコン

### 機能

- オフライン対応（オフライン時は `/~offline` ページを表示）
- Google Fonts、画像、静的アセットのキャッシュ
- プッシュ通知対応
- APIキャッシュ（NetworkFirst戦略）

### アイコン

現在はSVGプレースホルダーを使用。本番用には適切なPNGアイコンに差し替えること：

- `public/icon-192.png` (192x192)
- `public/icon-512.png` (512x512)

## Git フック

Lefthook により pre-commit で以下が実行されます：

- ESLint（リント＆自動修正）
- Prettier（フォーマット）
- TypeScript 型チェック
- Secretlint（シークレット検出）

コミットメッセージは Conventional Commits 形式に従ってください：

```
feat: 新機能を追加
fix: バグ修正
docs: ドキュメントのみの変更
style: コードの意味に影響しない変更
refactor: バグ修正でも機能追加でもないコード変更
test: テストの追加・修正
chore: ビルドプロセスやツールの変更
```
