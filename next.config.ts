import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // 開発時のホットリロード最適化
  reactStrictMode: true,
  // Docker開発環境でのファイル監視設定
  experimental: {
    // ファイル変更の監視を最適化
    ...(process.env.NODE_ENV === 'development' && {
      forceSwcTransforms: true,
    }),
  },
  // Dockerでのホットリロード用設定
  ...(process.env.NODE_ENV === 'development' && {
    webpack: (config) => {
      // ファイル監視の設定
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
      return config;
    },
  }),
};

export default withNextIntl(nextConfig);
