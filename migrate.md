# モノレポ移行作業ログ

## Turborepo とは？なぜ導入するのか？

### Turborepo の役割

**一言で言うと**：モノレポの「タスク実行を賢く管理する司令塔」

複数のパッケージ（apps/web、packages/ui など）があるモノレポで、ビルドやテストを効率的に実行するためのツール。

### 導入のメリット

| メリット | 説明 | 例え |
|---------|------|------|
| **キャッシュ** | 変更がないパッケージは前回の結果を再利用 | 作り置き料理。昨日作ったカレーがあるなら今日は作らない |
| **並列実行** | 依存関係がないパッケージは同時にビルド | 複数のコンロで同時に料理 |
| **依存関係の自動解決** | ビルド順序を自動で判断 | ui → web の順でビルドが必要なら自動で順序を決める |
| **一元管理** | ルートで `pnpm dev` するだけで全体が動く | 1つのリモコンで全部操作 |

### ビフォー・アフター

```
【Before: 単一パッケージ】
npm run build → 毎回全部ビルド（30秒）

【After: Turborepo】
pnpm build → 変更分だけビルド
           → 変更なければキャッシュ利用（0.5秒）
           → ">>> FULL TURBO" と表示されたらキャッシュ使用中
```

---

## 設定ファイルの解説

### pnpm-workspace.yaml

**役割**：「どのフォルダがワークスペース（パッケージ）か」を pnpm に教える

```yaml
packages:
  - "apps/*"      # apps/ 配下のフォルダをパッケージとして認識
  - "packages/*"  # packages/ 配下のフォルダをパッケージとして認識
```

**効果**：
- `apps/web` → `@jobpop/web` として認識
- `packages/ui` → `@jobpop/ui` として認識
- パッケージ間で `"@jobpop/ui": "workspace:*"` のように参照可能に

---

### turbo.json

**役割**：「各タスクをどう実行するか」のルールを定義

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    }
  }
}
```

**各設定の意味**：

| 設定 | 値 | 意味 |
|------|-----|------|
| `dependsOn: ["^build"]` | `^` = 依存先を先に | web が ui に依存しているなら、ui を先にビルド |
| `outputs` | `[".next/**", "dist/**"]` | キャッシュ対象のファイル。これらが同じなら再ビルド不要 |
| `cache: false` | キャッシュしない | dev サーバーは毎回起動が必要なのでキャッシュ無効 |
| `persistent: true` | 常駐プロセス | dev サーバーのように終了しないプロセス |

**図解**：

```
pnpm build 実行
      ↓
Turborepo が依存関係を解析
      ↓
┌────────────────────────────────────┐
│ 1. packages/database: ビルド       │
│ 2. packages/ui: ビルド（並列可）    │
│ 3. apps/web: 1,2 完了後にビルド    │
└────────────────────────────────────┘
      ↓
キャッシュがあれば再利用、なければ実行
```

---

### package.json（ルート）

**役割**：モノレポ全体の設定と、Turborepo 経由でのコマンド定義

```json
{
  "name": "@jobpop/root",
  "private": true,
  "packageManager": "pnpm@10.18.2",
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\""
  },
  "devDependencies": {
    "turbo": "^2",
    "prettier": "3.6.2",
    "typescript": "^5.9.3"
  }
}
```

**各設定の意味**：

| 設定 | 意味 |
|------|------|
| `name: "@jobpop/root"` | ルートパッケージの名前（内部管理用） |
| `private: true` | npm に公開しない |
| `packageManager` | 使用する pnpm のバージョン。Turborepo がこれを参照 |
| `turbo run dev` | Turborepo 経由で全パッケージの dev を実行 |
| `devDependencies` | 全パッケージで共通して使うツール |

---

### 各パッケージの package.json

**例：apps/web/package.json**

```json
{
  "name": "@jobpop/web",
  "dependencies": {
    "@jobpop/database": "workspace:*",  // 内部パッケージへの依存
    "@jobpop/ui": "workspace:*",
    "next": "^16.1.6"
  }
}
```

| 設定 | 意味 |
|------|------|
| `workspace:*` | 「同じモノレポ内のパッケージを使う」という指定 |

---

## よく使うコマンド

```bash
# 開発サーバー起動（全パッケージ）
pnpm dev

# ビルド（全パッケージ）
pnpm build

# 特定パッケージだけ実行
pnpm --filter @jobpop/web dev
pnpm --filter @jobpop/database db:studio

# 依存関係のインストール
pnpm install
```

---

## 概要

単一パッケージ構成から Turborepo + pnpm を使ったモノレポ構成に移行する。

### 移行前の構成

```
jobpop/
├── src/              # Next.js アプリ
├── prisma/           # Prisma スキーマ
├── scripts/          # スクリプト
├── public/
├── package.json      # 単一の package.json
└── ...
```

### 移行後の構成（目標）

```
jobpop/
├── apps/
│   └── web/                 # Next.js アプリ
├── packages/
│   ├── ui/                  # UI コンポーネント
│   ├── database/            # Prisma
│   └── scripts/             # スクリプト
├── turbo.json
├── package.json             # ルート（workspaces 定義）
└── pnpm-workspace.yaml
```

### 作業ステップ一覧

| Step | 内容 | 状態 |
|------|------|------|
| 1 | pnpm + Turborepo 初期設定 | 完了 |
| 2 | apps/web に Next.js を移動 | 完了 |
| 3 | packages/database に Prisma を移動 | 完了 |
| 4 | packages/scripts にスクリプトを移動 | 完了 |
| 5 | packages/ui にコンポーネントを移動 | 完了 |
| 6 | 動作確認・調整 | 完了 |

---

## Step 1: pnpm + Turborepo 初期設定

### 作業概要

モノレポの基盤となる設定ファイルを作成する

### 作業目的

- pnpm workspaces でパッケージ間の依存関係を管理できるようにする
- Turborepo でビルド・開発コマンドを効率化する

### 実施した作業

### 1-1. package-lock.json と node_modules を削除

npm の依存関係を削除し、pnpm に移行する準備。

```bash
rm -f package-lock.json
rm -rf node_modules
```

### 1-2. pnpm-workspace.yaml を作成

pnpm workspaces の定義ファイル。`apps/*` と `packages/*` 配下がワークスペースとして認識される。

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

### 1-3. turbo.json を作成

Turborepo の設定ファイル。ビルド・開発コマンドのキャッシュや依存関係を定義。

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    }
  }
}
```

### 1-4. ルートの package.json を編集

モノレポのルートとして機能するように編集。

変更点：
- `name`: `jobpop` → `@jobpop/root`
- `scripts`: Turborepo 経由に変更
- `devDependencies`: `turbo` を追加

```json
{
  "name": "@jobpop/root",
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\""
  }
}
```

### 1-5. apps/ と packages/ ディレクトリを作成

```bash
mkdir -p apps packages
```

### 1-6. .gitignore を更新

Turborepo のキャッシュディレクトリを追加。また、モノレポ対応でパスを調整。

```diff
- /node_modules
+ node_modules

+ # turbo
+ .turbo

- /.next/
- /out/
+ .next/
+ out/
```

### 1-7. pnpm install

```bash
pnpm install
```

### コミット

```
commit 08cad63
chore: setup pnpm + Turborepo monorepo foundation

- Remove package-lock.json, migrate to pnpm
- Add pnpm-workspace.yaml for workspace configuration
- Add turbo.json for Turborepo task orchestration
- Update root package.json for monorepo structure
- Update .gitignore for turbo cache
```

---

## Step 2: apps/web に Next.js を移動

### 作業概要

現在ルートにある Next.js アプリを `apps/web` ディレクトリに移動する

### 作業目的

- Next.js アプリを独立したワークスペースパッケージとして管理
- 将来的に複数のアプリ（admin、mobile など）を追加できる構造にする

### 実施した作業

### 2-1. apps/web ディレクトリを作成し、Next.js 関連ファイルを移動

```bash
mkdir -p apps/web
mv src apps/web/
mv public apps/web/
mv next.config.ts apps/web/
mv next-env.d.ts apps/web/
mv postcss.config.mjs apps/web/
mv components.json apps/web/
mv eslint.config.mjs apps/web/
mv tsconfig.json apps/web/
```

### 2-2. ビルドアーティファクトを削除

```bash
rm -f tsconfig.tsbuildinfo
rm -rf .next
```

### 2-3. apps/web/package.json を作成

Next.js アプリ用の package.json を作成。依存関係をルートから移動。

```json
{
  "name": "@jobpop/web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint ."
  },
  "dependencies": {
    // Next.js、React、UI ライブラリなど
  },
  "devDependencies": {
    // TypeScript、ESLint、Tailwind など
  }
}
```

### 2-4. ルートの package.json をシンプル化

ルートには共有の devDependencies のみ残す。

```json
{
  "name": "@jobpop/root",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\""
  },
  "devDependencies": {
    "turbo": "^2",
    "prettier": "3.6.2",
    "typescript": "^5.9.3"
  }
}
```

### 2-5. pnpm install で依存関係を再構成

```bash
rm -rf node_modules
pnpm install
```

結果：2 つのワークスペース（root + apps/web）が認識された。

### コミット

```
commit b0f303f
refactor: move Next.js app to apps/web

- Move src/, public/, config files to apps/web/
- Create apps/web/package.json with app dependencies
- Simplify root package.json (keep only turbo, prettier, typescript)
- Remove build artifacts (.next, tsconfig.tsbuildinfo)
```

---

## Step 3: packages/database に Prisma を移動

### 作業概要

Prisma スキーマとクライアントを `packages/database` パッケージとして独立させる

### 作業目的

- DB スキーマと型を一元管理
- 複数のアプリ/パッケージから `@jobpop/database` で参照できるようにする
- Prisma Client のインスタンスも一緒に管理

### 背景：Prisma 6.x の推奨設定

Prisma 6.x では、`node_modules` ではなくカスタム出力先を指定することが強く推奨されている。Prisma 7 では必須になる予定。

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/client"  // カスタム出力先
}
```

### 実施した作業

### 3-1. packages/database ディレクトリを作成

```bash
mkdir -p packages/database/src
```

### 3-2. prisma/ ディレクトリを移動

```bash
mv prisma packages/database/
```

### 3-3. schema.prisma に output 設定を追加

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/client"
}
```

### 3-4. packages/database/package.json を作成

```json
{
  "name": "@jobpop/database",
  "version": "0.1.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio"
  },
  "dependencies": {
    "@prisma/client": "^6.18.0",
    "@prisma/extension-accelerate": "^2.0.2"
  },
  "devDependencies": {
    "dotenv": "^16.4.5",
    "prisma": "^6.18.0",
    "typescript": "^5.9.3"
  }
}
```

### 3-5. packages/database/src/client.ts を作成

PrismaClient のシングルトンインスタンス。

```typescript
import { PrismaClient } from './generated/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### 3-6. packages/database/src/index.ts を作成（re-export）

```typescript
// PrismaClient instance
export { prisma } from './client'

// Re-export all types and enums from generated client
export * from './generated/client'
```

### 3-7. prisma.config.ts を packages/database に移動

```typescript
import path from 'node:path'
import { defineConfig } from 'prisma/config'
import { config } from 'dotenv'

// Load .env from monorepo root
config({ path: path.resolve(__dirname, '../../.env') })

export default defineConfig({
  schema: 'prisma/',
})
```

### 3-8. apps/web の import を更新

36 ファイルで `@prisma/client` → `@jobpop/database` に一括置換。

```typescript
// Before
import { Company } from '@prisma/client'
import { prisma } from '@/lib/prisma'

// After
import { Company, prisma } from '@jobpop/database'
```

### 3-9. apps/web に @jobpop/database を依存関係として追加

```json
{
  "dependencies": {
    "@jobpop/database": "workspace:*",
    // ...
  }
}
```

### 3-10. .gitignore に generated ディレクトリを追加

```diff
- /src/generated/prisma
+ # prisma generated client
+ packages/database/src/generated
```

### 3-11. prisma generate を実行して動作確認

```bash
pnpm --filter @jobpop/database generate
```

結果：`packages/database/src/generated/client` に正常に生成された。

### 最終的な packages/database の構造

```
packages/database/
├── prisma/
│   ├── schema.prisma
│   └── models/
├── prisma.config.ts
├── src/
│   ├── generated/client/  ← prisma generate で生成
│   ├── client.ts
│   └── index.ts
├── package.json
└── tsconfig.json
```

### コミット

```
commit 2d9d254
refactor: move Prisma to packages/database

- Create packages/database with Prisma schema and client
- Configure custom output path for generated client
- Update prisma.config.ts to point to packages/database
- Replace @prisma/client imports with @jobpop/database in apps/web
- Add @jobpop/database as workspace dependency

commit de784b8
chore: move prisma.config.ts to packages/database

- Move prisma.config.ts to packages/database for better organization
- Update dotenv config to load .env from monorepo root
- Add dotenv as devDependency
```

---

## Step 4: packages/scripts にスクリプトを移動

### 作業概要

スクレイピングやシードスクリプトを `packages/scripts` パッケージとして独立させる

### 作業目的

- スクリプトを独立したパッケージとして管理
- データベースパッケージへの依存関係を明確化
- 開発用ユーティリティを整理

### 実施した作業

### 4-1. packages/scripts ディレクトリを作成し、スクリプトを移動

```bash
mkdir -p packages/scripts
mv scripts/* packages/scripts/
rmdir scripts
```

### 4-2. packages/scripts/package.json を作成

```json
{
  "name": "@jobpop/scripts",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "seed": "tsx seed/seed.ts",
    "scrape": "tsx scraper/craigslist/index.ts"
  },
  "dependencies": {
    "@jobpop/database": "workspace:*",
    "playwright": "^1.52.0",
    "playwright-extra": "^4.3.6",
    "puppeteer-extra-plugin-stealth": "^2.11.2",
    "tsx": "^4.19.4"
  },
  "devDependencies": {
    "typescript": "^5.9.3"
  }
}
```

### 4-3. スクリプト内の import を更新

```typescript
// Before
import { prisma } from '@/lib/prisma'
import { Store } from '@prisma/client'

// After
import { prisma, Store } from '@jobpop/database'
```

### 4-4. pnpm install と動作確認

```bash
pnpm install
```

### 最終的な packages/scripts の構造

```
packages/scripts/
├── scraper/
│   └── craigslist/
│       ├── index.ts
│       └── ...
├── seed/
│   └── seed.ts
└── package.json
```

### コミット

```
commit 719367d
refactor: move scripts to packages/scripts

- Create packages/scripts with scraper and seed scripts
- Add dependencies: tsx, playwright, playwright-extra
- Update imports to use @jobpop/database
- Add npm scripts for seed and scrape commands
```

---

## Step 5: packages/ui にコンポーネントを移動

### 作業概要

共有 UI コンポーネントを `packages/ui` パッケージとして独立させる

### 作業目的

- UI コンポーネントを再利用可能なパッケージとして管理
- 将来的に複数のアプリで共有できるようにする
- shadcn/ui ベースのコンポーネントを一元管理

### 実施した作業

### 5-1. packages/ui ディレクトリを作成

```bash
mkdir -p packages/ui/src/components
```

### 5-2. UI コンポーネントを移動（29 コンポーネント）

```bash
mv apps/web/src/components/ui/* packages/ui/src/components/
```

移動したコンポーネント：
- avatar, badge, breadcrumb, button, calendar, card
- checkbox, collapsible, combobox, command, date-picker
- dialog, dropdown-menu, form, image-upload, input
- label, password-input, phone-input, popover, select
- separator, sheet, sidebar, skeleton, sonner
- spinner, textarea, tooltip

### 5-3. packages/ui/src/utils.ts を作成

`cn` ユーティリティ関数を移動。

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### 5-4. packages/ui/package.json を作成

```json
{
  "name": "@jobpop/ui",
  "version": "0.1.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./utils": "./src/utils.ts"
  },
  "dependencies": {
    "@radix-ui/react-avatar": "^1.1.11",
    "@radix-ui/react-checkbox": "^1.3.3",
    // ... Radix UI コンポーネント
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "date-fns": "^4.1.0",
    "lucide-react": "^0.552.0",
    "react-day-picker": "^9.11.1",
    "sonner": "^2.0.7",
    "tailwind-merge": "^3.3.1"
  },
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
```

### 5-5. packages/ui/src/index.ts を作成（re-export）

```typescript
// Utilities
export { cn } from './utils'

// Components
export * from './components/avatar'
export * from './components/badge'
export * from './components/button'
// ... 29 コンポーネントをエクスポート
```

### 5-6. コンポーネント内の import を更新

各コンポーネントの `@/lib/utils` を `../utils` に更新。

### 5-7. apps/web の import を一括更新

56 ファイルで import パスを更新。

```typescript
// Before
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// After
import { Button, cn } from '@jobpop/ui'
```

### 5-8. apps/web/package.json を更新

- `@jobpop/ui: "workspace:*"` を追加
- 重複する UI 依存関係を削除（@radix-ui/*, clsx, tailwind-merge など）

### 5-9. apps/web/src/lib/utils.ts を削除

packages/ui に移動したため不要。

### 最終的な packages/ui の構造

```
packages/ui/
├── src/
│   ├── components/
│   │   ├── avatar.tsx
│   │   ├── button.tsx
│   │   └── ... (29 コンポーネント)
│   ├── index.ts
│   └── utils.ts
├── package.json
└── tsconfig.json
```

### コミット

```
commit e1edfe3
refactor: move UI components to packages/ui

- Create packages/ui with shared UI components
- Move 29 UI components from apps/web/src/components/ui
- Move cn utility function from apps/web/src/lib/utils.ts
- Update all imports in apps/web to use @jobpop/ui
- Add @jobpop/ui as workspace dependency
```

---

## Step 6: 動作確認・調整

### 作業概要

モノレポ移行後の動作確認とビルドテスト

### 確認結果

- [x] `pnpm install` が正常に完了すること
- [x] `pnpm --filter @jobpop/database generate` が正常に動作すること
- [x] `pnpm build` でコンパイルが成功すること（環境変数を除く）

### 実施した調整

### 6-1. packageManager フィールドを追加

Turborepo が pnpm バージョンを認識できるように設定。

```json
{
  "packageManager": "pnpm@10.18.2"
}
```

### 6-2. apps/web に不足していた依存関係を追加

モノレポ化により packages/ui に移動したが、apps/web でも直接使用されるパッケージ。

```json
{
  "dependencies": {
    "lucide-react": "^0.552.0",
    "sonner": "^2.0.7"
  },
  "devDependencies": {
    "@types/google.maps": "^3.58.1"
  }
}
```

### 6-3. packages/ui の調整

**image-upload.tsx を apps/web に戻す**

`image-upload` コンポーネントはアプリ固有のサーバーアクション（S3 プリサイン URL）に依存しているため、共有 UI パッケージには適さない。

**use-mobile hook を packages/ui に移動**

`sidebar` コンポーネントが使用する `useIsMobile` フックを packages/ui に移動。

**peerDependencies を追加**

```json
{
  "peerDependencies": {
    "next-themes": "^0.4.0",
    "react-hook-form": "^7.0.0"
  }
}
```

### 6-4. 既存コードの修正

VisaType enum の変更に伴い、以下を修正：

- `VISA_LABELS` 定数を更新（新しい VisaType に対応）
- デフォルト値を `VISITOR` から `STUDY_PERMIT` に変更

その他の修正：

- `ScrollNav` に必須の `containerId` prop を追加
- 未実装の `JobsSection`、`ApplicantsSection` をコメントアウト
- `profile.ts` の export を削除（ファイル内容が全てコメントアウト）

### 最終的なパッケージ構造

```
packages/ui/
├── src/
│   ├── components/      # 28 UIコンポーネント
│   ├── hooks/           # use-mobile.ts
│   ├── index.ts
│   └── utils.ts
├── package.json
└── tsconfig.json

apps/web/
├── src/
│   ├── components/
│   │   └── ui/
│   │       └── image-upload.tsx  # アプリ固有コンポーネント
│   └── ...
└── package.json
```

### コミット

```
commit e1edfe3
refactor: move UI components to packages/ui

commit 396f4e0
fix: resolve build errors and adjust package structure
```

### 備考

ビルドは環境変数（Resend API キー等）が必要なため、CI/CD では `.env` の設定が必要。コンパイル自体は成功している。
