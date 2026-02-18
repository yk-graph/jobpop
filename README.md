# JobPop

カナダ在住の日本人向け求人プラットフォーム

## 概要

JobPopは、カナダで働く日本人と日本語対応可能な雇用者をつなぐ求人マッチングサービスです。

**主な機能:**
- 求職者: 求人検索・応募、プロフィール管理
- 雇用者: 企業・店舗管理、求人掲載、応募者管理

## 技術スタック

- **フレームワーク**: Next.js 16 (App Router)
- **言語**: TypeScript
- **データベース**: MySQL 8.0 + Prisma ORM
- **UI**: shadcn/ui + Tailwind CSS
- **認証**: better-auth
- **モノレポ**: Turborepo + pnpm

## ディレクトリ構成

```
jobpop/
├── apps/
│   └── web/                 # Next.js Webアプリケーション
│       └── src/
│           ├── app/
│           │   ├── (auth)/      # 認証（ログイン・登録）
│           │   ├── (seeker)/    # 求職者向けページ
│           │   └── (employer)/  # 雇用者向けページ
│           ├── components/      # UIコンポーネント
│           ├── lib/             # ユーティリティ
│           └── services/        # ビジネスロジック
│
├── packages/
│   ├── database/            # データベース（Prisma）
│   │   ├── prisma/              # スキーマ・マイグレーション
│   │   └── src/                 # Prismaクライアント
│   │
│   ├── ui/                  # 共有UIコンポーネント
│   │   └── src/
│   │       └── components/
│   │           ├── shadcn/      # shadcn/uiコンポーネント
│   │           └── custom/      # カスタムコンポーネント
│   │
│   └── scripts/             # スクリプト
│       ├── seed/                # シードデータ投入
│       └── scraper/             # データスクレイピング
│
└── docker-compose.yml       # ローカルDB用
```

## セットアップ

### 必要なツール

- Node.js 24.x（Volta推奨）
- pnpm 10.x
- Docker（ローカルDB用）

### インストール

```bash
# 依存関係のインストール
pnpm install

# Prismaクライアント生成
pnpm --filter @jobpop/database generate
```

### 環境変数

`.env` ファイルをルートに作成:

```env
DATABASE_URL="mysql://root:password@localhost:3306/jobpop_db"
```

## 開発

```bash
# MySQLを起動
docker compose up -d

# DBスキーマを適用
pnpm --filter @jobpop/database db:push

# 開発サーバー起動
pnpm dev
```

http://localhost:3000 でアクセス

## 主要コマンド

| コマンド | 説明 |
|---------|------|
| `pnpm dev` | 開発サーバー起動 |
| `pnpm build` | 本番ビルド |
| `pnpm lint` | ESLint実行 |
| `pnpm format` | Prettierでフォーマット |
| `pnpm check:versions` | 依存関係バージョン整合性チェック |
| `pnpm --filter @jobpop/database db:studio` | Prisma Studio起動 |
