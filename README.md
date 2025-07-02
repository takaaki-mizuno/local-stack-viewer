# LocalStack Viewer

LocalStackのS3とSESサービスを管理するWebアプリケーション

## 機能

### S3機能
- バケット一覧表示
- オブジェクト一覧・詳細表示
- ファイルダウンロード
- 画像プレビュー
- オブジェクト削除

### SES機能
- 送信メール一覧表示
- メール詳細情報表示
- HTMLメール表示
- 送受信者情報表示
- 送信時間表示

## 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS + ShadCN UI
- **AWS SDK**: @aws-sdk/client-s3, @aws-sdk/client-ses
- **テスト**: Jest, React Testing Library, Playwright
- **開発環境**: LocalStack

## セットアップ

### Option 1: Docker環境（推奨）

LocalStackとNext.jsアプリケーションの両方をDockerで起動：

```bash
# 全体を起動
npm run docker:up

# ログを確認
npm run docker:logs

# 停止
npm run docker:down
```

アプリケーションは http://localhost:3100 で利用できます。

### Option 2: ローカル開発環境

#### 1. 依存関係のインストール

```bash
npm install
```

#### 2. LocalStackの起動

```bash
npm run localstack:up
```

#### 3. 開発サーバーの起動

```bash
npm run dev
```

アプリケーションは http://localhost:3100 で利用できます。

## 利用可能なスクリプト

### 開発関連
- `npm run dev` - 開発サーバーを起動
- `npm run build` - プロダクションビルドを作成
- `npm run start` - プロダクションサーバーを起動
- `npm run lint` - ESLintによるコードチェック

### テスト関連
- `npm test` - Jestによるユニットテスト実行
- `npm run test:watch` - Jestのウォッチモード
- `npm run test:coverage` - テストカバレッジ計測
- `npm run test:e2e` - PlaywrightによるE2Eテスト実行

### Docker関連
- `npm run docker:up` - LocalStackとアプリケーションを起動
- `npm run docker:down` - 全体を停止
- `npm run docker:logs` - ログを表示
- `npm run docker:restart` - アプリケーションのみ再起動
- `npm run docker:build` - Dockerイメージをビルド

### LocalStack関連
- `npm run localstack:up` - LocalStackのみを起動
- `npm run localstack:down` - LocalStackを停止

## 環境変数

アプリケーションは以下の環境変数を使用します：

### LocalStackエンドポイント
- `LOCALSTACK_ENDPOINT` - サーバーサイド用LocalStackエンドポイント（デフォルト: http://localhost:4566）
  - ローカル開発: `http://localhost:4566`
  - Docker環境: `http://localstack:4566`
- `NEXT_PUBLIC_LOCALSTACK_ENDPOINT` - クライアントサイド用LocalStackエンドポイント（デフォルト: http://localhost:4566）
  - 常に: `http://localhost:4566`（ブラウザからのアクセス用）

### AWS認証情報
- `AWS_ACCESS_KEY_ID` - AWS アクセスキー（デフォルト: test）
- `AWS_SECRET_ACCESS_KEY` - AWS シークレットキー（デフォルト: test）
- `AWS_DEFAULT_REGION` - AWSリージョン（デフォルト: us-east-1）

### Docker環境での設定例

Docker環境では、サーバーサイドとクライアントサイドで異なるエンドポイントを使用します：

```bash
# .env.docker
LOCALSTACK_ENDPOINT=http://localstack:4566
NEXT_PUBLIC_LOCALSTACK_ENDPOINT=http://localhost:4566
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
AWS_DEFAULT_REGION=us-east-1
```

### ローカル開発での設定例

ローカル開発では、両方とも同じエンドポイントを使用します：

```bash
# .env.local
LOCALSTACK_ENDPOINT=http://localhost:4566
NEXT_PUBLIC_LOCALSTACK_ENDPOINT=http://localhost:4566
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
AWS_DEFAULT_REGION=us-east-1
```

## プロジェクト構成

```
src/
├── app/
│   ├── actions/           # Server Actions
│   │   ├── s3-actions.ts
│   │   └── ses-actions.ts
│   ├── s3/               # S3関連ページ
│   ├── ses/              # SES関連ページ
│   └── globals.css
├── components/           # Reactコンポーネント
│   ├── s3/
│   ├── ses/
│   ├── navigation.tsx
│   └── main-layout.tsx
├── lib/                  # ユーティリティ関数
│   ├── aws-config.ts
│   ├── s3-utils.ts
│   └── utils.ts
└── __tests__/           # テストファイル
    ├── components/
    └── lib/
tests/e2e/               # E2Eテスト
```

## テスト

### ユニットテスト

```bash
npm test
```

### E2Eテスト

LocalStackと開発サーバーが起動していることを確認してから：

```bash
npm run test:e2e
```

### テストカバレッジ

```bash
npm run test:coverage
```

## LocalStackでのテストデータ作成

### S3バケットとオブジェクトの作成

```bash
# バケット作成
aws --endpoint-url=http://localhost:4566 s3 mb s3://test-bucket

# ファイルアップロード
aws --endpoint-url=http://localhost:4566 s3 cp ./example.txt s3://test-bucket/
```

### SESでのメール送信

```bash
# メールアドレスの検証
aws --endpoint-url=http://localhost:4566 ses verify-email-identity --email-address test@example.com

# メール送信
aws --endpoint-url=http://localhost:4566 ses send-email \
  --source test@example.com \
  --destination ToAddresses=recipient@example.com \
  --message Subject={Data="Test Subject"},Body={Text={Data="Test message body"}}
```

## Docker環境の使用例

```bash
# 全体を起動
npm run docker:up

# サービスの状態を確認
docker compose ps

# LocalStackの健康状態を確認
curl http://localhost:4566/_localstack/health

# アプリケーションにアクセス
open http://localhost:3100

# ログを確認
npm run docker:logs

# 個別のサービスログを確認
docker compose logs localstack
docker compose logs app

# 停止
npm run docker:down
```

### Docker環境でのテストデータ作成

Docker環境が起動してから：

```bash
# S3バケットを作成
aws --endpoint-url=http://localhost:4566 s3 mb s3://test-bucket

# テストファイルを作成してアップロード
echo "Hello LocalStack!" > test.txt
aws --endpoint-url=http://localhost:4566 s3 cp test.txt s3://test-bucket/

# SESメールアドレスを検証
aws --endpoint-url=http://localhost:4566 ses verify-email-identity --email-address test@example.com

# テストメールを送信
aws --endpoint-url=http://localhost:4566 ses send-email \
  --source test@example.com \
  --destination ToAddresses=recipient@example.com \
  --message Subject={Data="Docker Test"},Body={Text={Data="Test from Docker environment"}}
```

## トラブルシューティング

### Docker環境
- アプリケーションが起動しない場合は、LocalStackの健康状態を確認してください
- ポート3100が使用中の場合は、docker-compose.ymlのポートマッピングを変更してください
- イメージの再ビルドが必要な場合：`docker compose build --no-cache app`

## ライセンス

MIT License