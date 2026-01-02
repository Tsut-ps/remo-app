# Nature Remo Controller

Nature Remo Mini を使って家電をブラウザから操作する Web アプリ。

## 機能

- 🏠 **家電一覧表示** - 登録されている全ての家電を表示
- 💡 **照明操作** - ON/OFF、明るさ調整
- ❄️ **エアコン操作** - 温度、モード、風量、風向の設定
- 📺 **TV 操作** - 電源、音量、チャンネル操作
- 📡 **IR リモコン** - カスタム赤外線信号の送信
- 🔑 **API キー管理** - ブラウザに安全に保存

## ローカル開発

```bash
# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

[http://localhost:3000](http://localhost:3000) でアプリが起動します。

## GitHub Pages へのデプロイ

### 自動デプロイ（推奨）

1. GitHub リポジトリを作成
2. コードをプッシュ:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/remo-app.git
   git push -u origin main
   ```
3. GitHub リポジトリの設定:
   - **Settings** → **Pages** → **Source** で "GitHub Actions" を選択
4. `main` ブランチにプッシュすると自動でデプロイされます

### 手動デプロイ

```bash
npm run build
# ./out ディレクトリの内容をホスティングサービスにアップロード
```

## 技術スタック

- [Next.js 16](https://nextjs.org/) - React フレームワーク
- [shadcn/ui](https://ui.shadcn.com/) - UI コンポーネント
- [Tailwind CSS v4](https://tailwindcss.com/) - スタイリング
- [Jotai](https://jotai.org/) - 状態管理
- [Lucide React](https://lucide.dev/) - アイコン

## API キーの取得

1. [Nature Home](https://home.nature.global/) にアクセス
2. ログイン後、設定 → API を選択
3. アクセストークンを生成

## ライセンス

MIT
