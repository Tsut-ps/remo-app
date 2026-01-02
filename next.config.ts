import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1] || "remo-app";

const nextConfig: NextConfig = {
  // GitHub Pages用の静的エクスポート設定
  output: "export",

  // GitHub Pagesのサブパス対応（https://username.github.io/repo-name/）
  basePath: isProd ? `/${repoName}` : "",
  assetPrefix: isProd ? `/${repoName}/` : "",

  // 画像最適化はサーバーレスなので無効化
  images: {
    unoptimized: true,
  },

  // 末尾スラッシュを追加（GitHub Pages互換性）
  trailingSlash: true,
};

export default nextConfig;
