# CLAUDE.md — 開発ルール & プロジェクトメモ

## プロジェクト概要

英単語学習クイズアプリ。Supabase に登録された単語データを使い、
日→英 / 英→日 の2モードで1日10問の入力式クイズを出題する。

---

## 現在の実装状況（2026-05-29 時点）

### 画面遷移

```
StartScreen → PreviewScreen → QuizScreen → ResultScreen
```

### 各画面の役割

| 画面 | ファイル | 概要 |
|------|----------|------|
| スタート | `StartScreen.jsx` | モード選択（日→英 / 英→日） |
| プレビュー | `PreviewScreen.jsx` | 今日の10問を一覧表示。英単語横に🎤ボタン |
| クイズ | `QuizScreen.jsx` | 入力式クイズ。英単語右上に🎤ボタン |
| リザルト | `ResultScreen.jsx` | スコア表示・間違えた単語の確認 |

### 主な機能

- **1日10問**: ランダムに10問抽出（旧50問から変更）
- **プレビュー画面**: クイズ開始前に今日の10問を一覧表示
  - JP→EN モード: 日本語 / 品詞 / 英単語
  - EN→JP モード: 品詞 / 英単語 / 日本語
- **🎤 発音ボタン**: 英単語が表示される箇所（プレビュー・クイズ問題・フィードバック）に配置
  - Web Speech API（ブラウザ標準）を使用、API キー不要
  - `~` `〜` は発音対象外として除去してから読み上げ
- **キーボード操作**: Enter で決定、回答後200ms遅延後に再び Enter で次の問題へ

### データ構造（Supabase `words` テーブル）

| カラム | 型 | 説明 |
|--------|----|------|
| id | int | PK |
| word | text | 英単語 |
| meaning | text | 日本語訳 |
| category | text | 品詞（名詞・動詞 等） |

---

## 技術スタック

- **フロントエンド**: React 18（関数コンポーネント + Hooks）
- **ビルドツール**: Vite 5
- **言語**: JavaScript（TypeScript は使用しない）
- **バックエンド / DB**: Supabase（`@supabase/supabase-js` v2）

---

## 環境セットアップ

### 必須手順（社内プロキシ環境）

```bash
# 1. リポジトリをクローン
git clone https://github.com/kentarofujirai/nao_english.git .

# 2. .npmrc でプロキシをバイパス（これをやらないと npm install がタイムアウトする）
# → リポジトリに .npmrc が含まれているので自動で適用される

# 3. 依存パッケージをインストール
npm install

# 4. 開発サーバーを起動
npm run dev
```

### .npmrc（プロキシバイパス設定）

社内プロキシ（`172.21.1.17:8080`）が npm レジストリへの通信をブロックするため、
プロジェクトルートの `.npmrc` でプロキシを無効化している。

```
proxy=null
https-proxy=null
```

### vite.config.js（Supabase プロキシ設定）

ブラウザからの Supabase 接続もプロキシにブロックされるため、
Vite の開発サーバーを中継（`/supabase-api` → Supabase URL）している。

```js
server: {
  proxy: {
    '/supabase-api': {
      target: 'https://yvtxrezzmoimdfzfoyou.supabase.co',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/supabase-api/, ''),
    }
  }
}
```

### 環境変数（.env.local）

```
VITE_SUPABASE_URL=https://yvtxrezzmoimdfzfoyou.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_bpFUDR2eutqk4j-K9iCUPA_aK9GYEhC
```

---

## コーディング規約

- コンポーネントは関数コンポーネントで記述する
- ファイル名はコンポーネントは PascalCase、それ以外は camelCase
- Supabase クライアントは `src/lib/supabaseClient.js` に集約する
- 環境変数は `VITE_` プレフィックスを付ける
- コメントは理由が非自明な箇所にのみ記載する（何をしているかではなく、なぜか）
- セキュリティ上の理由から、Supabase の `service_role` キーはクライアントサイドに含めない

---

## ディレクトリ構成

```
src/
  components/     # UI コンポーネント
    StartScreen.jsx
    PreviewScreen.jsx   # クイズ前の10問プレビュー
    QuizScreen.jsx
    ResultScreen.jsx
  hooks/
    useQuiz.js          # クイズ状態管理（問題・スコア・正誤）
  lib/
    supabaseClient.js   # Supabase クライアント（開発時はプロキシ経由）
  App.jsx               # 画面遷移・問題データのフェッチ
  index.css
  main.jsx
```

---

## Git 運用ルール

**コードを変更するたびに、必ず GitHub へプッシュすること。**

```bash
git add <変更ファイル>
git commit -m "変更内容の要約"
git push origin main
```

### コミットメッセージ規則

- `feat:` 新機能
- `fix:` バグ修正
- `refactor:` リファクタリング
- `docs:` ドキュメント更新

### 注意事項

- `.env.local` には公開可能な anon キーのみ含む（service_role キーは絶対にコミットしない）
- `main` ブランチへの直接プッシュは原則禁止（小規模開発中は許容）
