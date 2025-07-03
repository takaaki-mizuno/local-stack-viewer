# マルチステージビルド
FROM node:18-alpine AS base

# 依存関係のインストール用ステージ
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 依存関係ファイルをコピー
COPY package.json package-lock.json* ./
RUN npm ci

# ビルドステージ
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.jsテレメトリーを無効化
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# 本番用ランナーステージ
FROM base AS runner
WORKDIR /app

# ログ出力を有効にするため、NODE_ENVをdevelopmentに設定
# ENV NODE_ENV production
ENV NODE_ENV development
ENV NEXT_TELEMETRY_DISABLED 1
# ログレベルを設定してデバッグ情報を出力
ENV DEBUG "*"
ENV LOG_LEVEL "debug"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

ENV PORT 3000
# HOSTNAMEはnext startでは不要なためコメントアウト
# ENV HOSTNAME "0.0.0.0"

CMD ["npm", "start"]