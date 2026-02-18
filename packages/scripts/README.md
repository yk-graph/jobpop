## Indeed スクレイパー

Indeedから求人情報を自動収集するスクリプト集です。

---

## セットアップ

### 依存パッケージのインストール

プロジェクトルートで実行：

```bash
pnpm install
```

### 初回ログイン（スキル情報を取得する場合）

スキル情報はIndeedにログインしないと表示されません。以下のコマンドでセッションを保存してください。

```bash
pnpm --filter @jobpop/scripts tsx scraper/login.ts
```

1. ブラウザが開きます
2. Indeedにログインしてください
3. ログイン完了後、ターミナルでEnterキーを押してください
4. セッションが `packages/scripts/scraper/indeed-session.json` に保存されます

※ セッションが切れたら再度このコマンドを実行してください

---

## 使い方

### 基本的な使い方

```bash
pnpm --filter @jobpop/scripts scrape:indeed "検索キーワード" "場所"
```

### 例

```bash
# バリスタの仕事をバンクーバーで検索
pnpm --filter @jobpop/scripts scrape:indeed "Barista" "Vancouver, BC"

# ソフトウェアエンジニアをトロントで検索（3ページ分）
pnpm --filter @jobpop/scripts scrape:indeed "Software Engineer" "Toronto, ON" --pages=3
```

---

## オプション一覧

| オプション | 説明 | 例 |
|-----------|------|-----|
| `--pages` | 取得するページ数（デフォルト: 1） | `--pages=3` |
| `--radius` | 検索範囲（km） | `--radius=25` |
| `--sort` | ソート順（`date` または `relevance`） | `--sort=date` |
| `--fromage` | 投稿日（`last`, `1`, `3`, `7`, `14`） | `--fromage=last` |
| `--jobType` | 雇用形態 | `--jobType=part-time` |

### jobTypeの選択肢

- `part-time` - パートタイム
- `full-time` - フルタイム
- `permanent` - 正社員
- `contract` - 契約
- `temporary` - 一時的
- `internship` - インターンシップ / Co-op
- `freelance` - フリーランス

### 使用例（全オプション）

```bash
pnpm --filter @jobpop/scripts scrape:indeed "Barista" "Vancouver, BC" \
  --pages=2 \
  --radius=25 \
  --sort=date \
  --fromage=last \
  --jobType=part-time
```

---

## 出力ファイル

### search-result.json

スクレイピング結果は `packages/scripts/scraper/search-result.json` に保存されます。

- 新しい求人は既存データに追加されます（上書きではない）
- 重複するIDの求人はスキップされます
- 各求人には `createdAt` タイムスタンプが自動付与されます

### 出力データの構造

```json
{
  "id": "abc123",
  "title": "Barista",
  "company": "Coffee Shop",
  "companyUrl": "https://...",
  "location": "Vancouver, BC",
  "salary": "$18.00 an hour",
  "jobType": "Part-time",
  "skills": ["Customer service", "Cash handling"],
  "benefits": ["Flexible schedule"],
  "shiftAndSchedule": ["Morning shift", "Weekends"],
  "description": "...",
  "url": "https://...",
  "createdAt": "2026-02-10T11:30:00.000Z"
}
```

---

## ファイル構成

```
packages/scripts/
├── scraper/
│   ├── indeed.ts           # メインスクレイパー
│   ├── login.ts            # ログイン用スクリプト
│   ├── types.ts            # 型定義
│   ├── utils.ts            # ユーティリティ関数
│   ├── extract-master.ts   # データ抽出
│   ├── geocode-locations.ts # 位置情報変換
│   ├── indeed-session.json # セッション情報（自動生成）
│   └── search-result.json  # 収集結果（自動生成）
├── seed/
│   ├── seedExperience.ts   # 経験データ投入
│   ├── seedDummyJobs.ts    # ダミー求人データ投入
│   └── seedBaristaJobs.ts  # バリスタ求人データ投入
├── package.json
└── README.md               # このファイル
```

---

## 利用可能なスクリプト

```bash
# スクレイパー
pnpm --filter @jobpop/scripts scrape:indeed "キーワード" "場所"

# シードデータ投入
pnpm --filter @jobpop/scripts seed:experience
pnpm --filter @jobpop/scripts seed:job
pnpm --filter @jobpop/scripts seed:barista
```

---

## トラブルシューティング

### CAPTCHA/ボット検出が表示される

- 10〜15分待ってから再実行
- VPNを使用してIPアドレスを変更
- 通常のブラウザでIndeedにアクセスしてCAPTCHAを解決

### スキルが取得できない

- `login.ts` でIndeedにログインしてください
- セッションが切れている可能性があります。再度ログインしてください

### ブラウザが起動しない

- Chromeがインストールされているか確認
- プロジェクトルートで `pnpm install` を再実行
