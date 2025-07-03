#!/usr/bin/env node

const { S3Client, CreateBucketCommand, PutObjectCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
  endpoint: process.env.LOCALSTACK_ENDPOINT || 'http://localstack:4566',
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'test',
    secretAccessKey: 'test',
  },
  forcePathStyle: true,
});

async function createTestData() {
  try {
    console.log('Creating test S3 buckets and objects...');
    
    // バケット作成
    const buckets = ['test-bucket-1', 'test-bucket-2', 'image-bucket'];
    
    for (const bucketName of buckets) {
      try {
        await s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
        console.log(`Created bucket: ${bucketName}`);
      } catch (error) {
        if (error.name === 'BucketAlreadyOwnedByYou') {
          console.log(`Bucket already exists: ${bucketName}`);
        } else {
          throw error;
        }
      }
    }
    
    // テストファイル作成
    const testFiles = [
      {
        bucket: 'test-bucket-1',
        key: 'documents/readme.txt',
        content: 'This is a test document for LocalStack S3 viewer.',
        contentType: 'text/plain'
      },
      {
        bucket: 'test-bucket-1',
        key: 'data/config.json',
        content: JSON.stringify({ name: 'test-config', version: '1.0.0' }, null, 2),
        contentType: 'application/json'
      },
      {
        bucket: 'test-bucket-2',
        key: 'logs/app.log',
        content: '2025-01-01 10:00:00 INFO Application started\n2025-01-01 10:00:01 DEBUG Initializing components',
        contentType: 'text/plain'
      },
      {
        bucket: 'image-bucket',
        key: 'sample.html',
        content: `<!DOCTYPE html>
<html>
<head><title>Sample HTML</title></head>
<body>
  <h1>サンプルHTMLファイル</h1>
  <p>これはLocalStack S3に保存されたHTMLファイルです。</p>
</body>
</html>`,
        contentType: 'text/html'
      }
    ];
    
    for (const file of testFiles) {
      await s3Client.send(new PutObjectCommand({
        Bucket: file.bucket,
        Key: file.key,
        Body: file.content,
        ContentType: file.contentType,
        Metadata: {
          'created-by': 'test-script',
          'purpose': 'demo'
        }
      }));
      console.log(`Created object: ${file.bucket}/${file.key}`);
    }
    
    console.log('Test S3 data created successfully!');
  } catch (error) {
    console.error('Failed to create test data:', error);
  }
}

createTestData();