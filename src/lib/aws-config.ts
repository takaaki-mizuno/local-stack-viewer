import { S3Client } from "@aws-sdk/client-s3";
import { SESClient } from "@aws-sdk/client-ses";

const localstackEndpoint =
  process.env.LOCALSTACK_ENDPOINT || "http://localhost:4566";

export const s3Client = new S3Client({
  endpoint: localstackEndpoint,
  region: process.env.AWS_DEFAULT_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "test",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "test",
  },
  forcePathStyle: true,
});

export const sesClient = new SESClient({
  endpoint: localstackEndpoint,
  region: process.env.AWS_DEFAULT_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "test",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "test",
  },
});
