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
pnpm --filter @jobpop/scripts scrape:login
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

| オプション  | 説明                                  | 例                    |
| ----------- | ------------------------------------- | --------------------- |
| `--pages`   | 取得するページ数（デフォルト: 1）     | `--pages=3`           |
| `--radius`  | 検索範囲（km）                        | `--radius=25`         |
| `--sort`    | ソート順（`date` または `relevance`） | `--sort=date`         |
| `--fromage` | 投稿日（`last`, `1`, `3`, `7`, `14`） | `--fromage=last`      |
| `--jobType` | 雇用形態                              | `--jobType=part-time` |

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

## ディレクトリ構成

```
data/
├── origin/                      # スクレイピング結果（生データ）
│   ├── search-result-barista.json
│   └── search-result-software-engineer.json
│
└── shape/                       # 加工済みデータ
    ├── unique-id-data.json      # 重複除去済みの全データ
    ├── location-data.json       # ロケーション情報ありのデータ
    ├── report.json              # スキル・福利厚生等のレポート
    └── title-report.json        # ユニークなタイトル一覧
```

---

## 出力ファイル

### 1. origin/search-result-{query}.json

スクレイピング結果は検索キーワードに基づいたファイル名で `data/origin/` に保存されます。

| 検索キーワード | 出力ファイル |
|---------------|-------------|
| `"Barista"` | `data/origin/search-result-barista.json` |
| `"Software Engineer"` | `data/origin/search-result-software-engineer.json` |

- ファイルが存在しない場合は新規作成
- ファイルが存在する場合はデータを追記
- 重複するIDの求人はスキップされます
- 各求人には `createdAt` タイムスタンプが自動付与されます

### 2. shape/unique-id-data.json

`origin/` 内のすべてのJSONファイルをマージし、IDの重複を除去したデータ。

### 3. shape/location-data.json

ロケーション情報があるデータのみを抽出。以下の条件で判定：
- `location` をカンマで分割して3つ以上のパーツがある
- 例: `"845 Hornby Street, Vancouver, BC"` → 3パーツ → ✅
- 例: `"Vancouver, BC"` → 2パーツ → ❌

### 4. shape/report.json

全データから抽出したレポートデータ：

```json
{
  "skills": {
    "barista": ["Customer service", "Food handling"],
    "server": ["Cash handling", "Customer service"]
  },
  "benefits": ["Dental care", "Flexible schedule", "Paid time off"],
  "shiftAndSchedule": ["8 hour shift", "Day shift", "Morning shift"],
  "reports": [
    {
      "resultCounts": 1000,
      "uniqueCounts": 500,
      "locationCounts": 100,
      "reportDate": "2026-02-18"
    }
  ]
}
```

| フィールド | 説明 |
|-----------|------|
| `skills` | 検索キーワード別のスキル一覧 |
| `benefits` | 全データから抽出した福利厚生一覧 |
| `shiftAndSchedule` | 全データから抽出したシフト一覧 |
| `reports` | 処理結果のサマリー |

### 5. shape/title-report.json

全データからユニークな求人タイトルを抽出した一覧。完全に同一の文字列のタイトルは除外されます。

```json
[
  "Barista",
  "Barista - Full Time",
  "Head Barista",
  "Server",
  "Server / Bartender"
]
```

### 出力データの構造（求人データ）

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
├── data/                        # 出力ディレクトリ（自動生成）
│   ├── origin/                  # スクレイピング結果（生データ）
│   │   └── search-result-*.json
│   └── shape/                   # 加工済みデータ
│       ├── unique-id-data.json
│       ├── location-data.json
│       ├── report.json
│       └── title-report.json
├── scraper/
│   ├── indeed.ts                # メインスクレイパー
│   ├── login.ts                 # ログイン用スクリプト
│   ├── report.ts                # データ加工・レポート生成
│   ├── types.ts                 # 型定義
│   ├── utils.ts                 # ユーティリティ関数
│   ├── geocode-locations.ts     # 位置情報変換
│   └── indeed-session.json      # セッション情報（自動生成）
├── seed/
│   ├── seedExperience.ts        # 経験データ投入
│   ├── seedDummyJobs.ts         # ダミー求人データ投入
│   └── seedBaristaJobs.ts       # バリスタ求人データ投入
├── package.json
└── README.md                    # このファイル
```

---

## 利用可能なスクリプト

```bash
# スクレイパー
pnpm --filter @jobpop/scripts scrape:indeed "キーワード" "場所"
pnpm --filter @jobpop/scripts scrape:login

# データ加工（origin → shape）
pnpm --filter @jobpop/scripts data:report

# シードデータ投入
pnpm --filter @jobpop/scripts seed:experience
pnpm --filter @jobpop/scripts seed:job
pnpm --filter @jobpop/scripts seed:barista
```

---

## データ加工の流れ

```
1. スクレイピング実行
   pnpm --filter @jobpop/scripts scrape:indeed "Barista" "Vancouver"
   pnpm --filter @jobpop/scripts scrape:indeed "Server" "Vancouver"
       ↓
   data/origin/search-result-barista.json
   data/origin/search-result-server.json

2. データ加工実行
   pnpm --filter @jobpop/scripts data:report
       ↓
   data/shape/unique-id-data.json   (全データ、重複除去済み)
   data/shape/location-data.json    (ロケーション情報ありのみ)
   data/shape/report.json           (スキル等のレポート)
   data/shape/title-report.json     (ユニークなタイトル一覧)
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
