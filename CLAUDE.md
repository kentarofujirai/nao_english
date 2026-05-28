# CLAUDE.md — 開発ルール

## 技術スタック

- **フロントエンド**: React (関数コンポーネント + Hooks)
- **ビルドツール**: Vite
- **言語**: JavaScript (TypeScript は使用しない)
- **バックエンド / DB**: Supabase (認証・データベース・ストレージ)

## コーディング規約

- コンポーネントは関数コンポーネントで記述する
- ファイル名はコンポーネントは PascalCase、それ以外は camelCase
- Supabase クライアントは `src/lib/supabaseClient.js` に集約する
- 環境変数は `.env` ファイルで管理し、`VITE_` プレフィックスを付ける
- コメントは理由が非自明な箇所にのみ記載する（何をしているかではなく、なぜか）

## ディレクトリ構成（予定）

```
src/
  components/   # 再利用可能な UI コンポーネント
  pages/        # ページ単位のコンポーネント
  lib/          # Supabase クライアントなどの外部連携
  hooks/        # カスタムフック
  assets/       # 画像・フォントなどの静的ファイル
```

## 環境変数

`.env` に以下を定義する（`.env` は Git 管理外）:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## その他

- パッケージマネージャは npm を使用する
- 不要なライブラリは追加しない
- セキュリティ上の理由から、Supabase の `service_role` キーはクライアントサイドに含めない
