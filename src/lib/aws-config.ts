import { S3Client } from "@aws-sdk/client-s3";
import { SESClient } from "@aws-sdk/client-ses";

// サーバーサイド用エンドポイント（Docker内では localstack、ローカルでは localhost）
const serverSideEndpoint =
  process.env.LOCALSTACK_ENDPOINT || "http://localhost:4566";

// クライアントサイド用エンドポイント（ブラウザからは常に localhost）
const clientSideEndpoint =
  process.env.NEXT_PUBLIC_LOCALSTACK_ENDPOINT || "http://localhost:4566";

// サーバーサイド用S3クライアント（バケット一覧、オブジェクト操作など）
export const s3Client = new S3Client({
  endpoint: serverSideEndpoint,
  region: process.env.AWS_DEFAULT_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "test",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "test",
  },
  forcePathStyle: true,
});

// クライアントサイド用S3クライアント（署名付きURL生成用）
export const s3ClientForPresignedUrl = new S3Client({
  endpoint: clientSideEndpoint,
  region: process.env.AWS_DEFAULT_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "test",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "test",
  },
  forcePathStyle: true,
});

export const sesClient = new SESClient({
  endpoint: serverSideEndpoint,
  region: process.env.AWS_DEFAULT_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "test",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "test",
  },
});
