"use server";

import {
  ListBucketsCommand,
  ListObjectsV2Command,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, s3ClientForPresignedUrl } from "@/lib/aws-config";

export interface S3Bucket {
  name: string;
  creationDate: Date | undefined;
}

export interface S3Object {
  key: string;
  lastModified: Date | undefined;
  size: number;
  storageClass: string | undefined;
}

export interface S3ObjectDetail {
  key: string;
  size: number;
  lastModified: Date | undefined;
  contentType: string | undefined;
  metadata: Record<string, string>;
  downloadUrl: string;
}

export async function listBuckets(): Promise<S3Bucket[]> {
  try {
    const serverSideEndpoint = process.env.LOCALSTACK_ENDPOINT || 'http://localhost:4566';
    console.log('Attempting to connect to LocalStack S3 at:', serverSideEndpoint);
    console.log('S3 Client config:', {
      endpoint: serverSideEndpoint,
      region: process.env.AWS_DEFAULT_REGION || 'us-east-1',
      forcePathStyle: true
    });
    
    const command = new ListBucketsCommand({});
    const response = await s3Client.send(command);
    console.log('S3 ListBuckets response:', response);

    return (
      response.Buckets?.map((bucket) => ({
        name: bucket.Name!,
        creationDate: bucket.CreationDate,
      })) || []
    );
  } catch (error) {
    console.error("Failed to list buckets:", error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      code: error && typeof error === 'object' && 'code' in error ? error.code : undefined,
      statusCode: error && typeof error === 'object' && '$metadata' in error && 
        error.$metadata && typeof error.$metadata === 'object' && 'httpStatusCode' in error.$metadata
        ? error.$metadata.httpStatusCode : undefined,
      endpoint: process.env.LOCALSTACK_ENDPOINT,
      region: process.env.AWS_DEFAULT_REGION
    });
    throw new Error("バケット一覧の取得に失敗しました");
  }
}

export async function listObjects(
  bucketName: string,
  prefix?: string
): Promise<S3Object[]> {
  try {
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: prefix,
    });
    const response = await s3Client.send(command);

    return (
      response.Contents?.map((object) => ({
        key: object.Key!,
        lastModified: object.LastModified,
        size: object.Size || 0,
        storageClass: object.StorageClass,
      })) || []
    );
  } catch (error) {
    console.error("Failed to list objects:", error);
    throw new Error("オブジェクト一覧の取得に失敗しました");
  }
}

export async function getObjectDetail(
  bucketName: string,
  objectKey: string
): Promise<S3ObjectDetail> {
  try {
    const headCommand = new HeadObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
    });
    const headResponse = await s3Client.send(headCommand);

    const getCommand = new GetObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
    });
    const downloadUrl = await getSignedUrl(s3ClientForPresignedUrl, getCommand, {
      expiresIn: 3600,
    });

    return {
      key: objectKey,
      size: headResponse.ContentLength || 0,
      lastModified: headResponse.LastModified,
      contentType: headResponse.ContentType,
      metadata: headResponse.Metadata || {},
      downloadUrl,
    };
  } catch (error) {
    console.error("Failed to get object detail:", error);
    throw new Error("オブジェクト詳細の取得に失敗しました");
  }
}

export async function deleteObject(
  bucketName: string,
  objectKey: string
): Promise<void> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
    });
    await s3Client.send(command);
  } catch (error) {
    console.error("Failed to delete object:", error);
    throw new Error("オブジェクトの削除に失敗しました");
  }
}
