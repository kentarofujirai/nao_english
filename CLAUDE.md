# CLAUDE.md — 開発ルール & プロジェクトメモ

## プロジェクト概要

英単語学習クイズアプリ。Supabase に登録された単語データを使い、
日→英 / 英→日 の2モードで1日10問の入力式クイズを出題する。
学習記録をカレンダーで確認でき、一緒に冒険する犬（ゴールデンレトリバー風）が
学習日数に応じて成長していく。

---

## 現在の実装状況（2026-05-29 時点）

### 画面遷移

```
StartScreen
  ├─ クエスト開始 → PreviewScreen → QuizScreen → ResultScreen
  │                                                    └─ 学習記録を見る ─┐
  └─ 学習カレンダーを見る ──────────────────────────────────────────→ CalendarScreen
                                                                          └─ クエストへ戻る → StartScreen
```

### 各画面の役割

| 画面 | ファイル | 概要 |
|------|----------|------|
| スタート | `StartScreen.jsx` | モード選択・カレンダーボタン |
| プレビュー | `PreviewScreen.jsx` | 今日の10問一覧。英単語横に🎤ボタン |
| クイズ | `QuizScreen.jsx` | 入力式クイズ。英単語右上に🎤ボタン |
| リザルト | `ResultScreen.jsx` | スコア表示。「📅 学習記録を見る」が主ボタン |
| カレンダー | `CalendarScreen.jsx` | 月次カレンダー＋犬の成長 |

### 主な機能

- **1日10問**: ランダムに10問抽出
- **プレビュー画面**: クイズ開始前に今日の10問を一覧表示
  - JP→EN: 日本語 / 品詞 / 英単語
  - EN→JP: 品詞 / 英単語 / 日本語
- **🎤 発音ボタン**: 英単語箇所に配置（Web Speech API）
  - `~` `〜` は発音対象外
- **Enter キー操作**: 決定→判定→次へ（200ms 遅延で誤動作防止）
- **学習カレンダー**:
  - 2026年6月〜月単位表示、◀前月 / 次月▶ で遷移
  - 当日の学習結果を日付セルに表示（7/10 など）
  - 色分け：緑=全正解 / 金=70%以上 / 赤=69%以下
  - 記録は `localStorage` に保存（キー: `nao_english_study_records`）
  - クイズ完了後に自動でカレンダーへ遷移
- **犬の成長システム**:
  - ゴールデンレトリバー風 SVG が学習日数に応じて6段階成長
  - 学習日数: 0→1→4→8→15→28日でステージアップ
  - ステージ4以上でしっぽアニメーション
  - クイズ直後はハートアニメーション（エサをあげた演出）

### データ構造（Supabase `words` テーブル）

| カラム | 型 | 説明 |
|--------|----|------|
| id | int | PK |
| word | text | 英単語 |
| meaning | text | 日本語訳 |
| category | text | 品詞（名詞・動詞 等） |

### 学習記録データ構造（localStorage）

```json
{
  "2026-06-01": { "score": 7, "total": 10 },
  "2026-06-03": { "score": 10, "total": 10 }
}
```

---

## 技術スタック

- **フロントエンド**: React 18（関数コンポーネント + Hooks）
- **ビルドツール**: Vite 5
- **言語**: JavaScript（TypeScript は使用しない）
- **バックエンド / DB**: Supabase（`@supabase/supabase-js` v2）
- **記録保存**: localStorage（認証不要のシンプル実装）

---

## 環境セットアップ

### 必須手順（社内プロキシ環境）

```bash
# 1. リポジトリをクローン
git clone https://github.com/kentarofujirai/nao_english.git .

# 2. npm install（.npmrc がプロキシをバイパスするため自動で適用）
npm install

# 3. 開発サーバーを起動
npm run dev
```

### .npmrc（プロキシバイパス設定）

社内プロキシ（`172.21.1.17:8080`）が npm レジストリへの通信をブロックするため
プロジェクトルートの `.npmrc` でプロキシを無効化している。

```
proxy=null
https-proxy=null
```

### vite.config.js（Supabase プロキシ設定）

ブラウザからの Supabase 接続もプロキシにブロックされるため
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
- コメントは理由が非自明な箇所にのみ記載する
- セキュリティ上の理由から Supabase の `service_role` キーはクライアントサイドに含めない

---

## ディレクトリ構成

```
src/
  components/
    StartScreen.jsx       # スタート画面（モード選択・カレンダーボタン）
    PreviewScreen.jsx     # クイズ前10問プレビュー（🎤ボタン付き）
    QuizScreen.jsx        # クイズ画面（🎤ボタン付き）
    ResultScreen.jsx      # 結果画面（学習記録ボタン付き）
    CalendarScreen.jsx    # 月次カレンダー＋犬の成長パネル
  hooks/
    useQuiz.js            # クイズ状態管理
    useStudyRecords.js    # localStorage 学習記録 CRUD
  lib/
    supabaseClient.js     # Supabase クライアント（開発時はプロキシ経由）
  App.jsx                 # 画面遷移・問題フェッチ・記録保存
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
