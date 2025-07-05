"use server";

import { ListBucketsCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/aws-config";

export interface ServiceStatus {
  s3: {
    available: boolean;
    error?: string;
  };
  ses: {
    available: boolean;
    error?: string;
  };
}

export async function checkS3Status(): Promise<{ available: boolean; error?: string }> {
  try {
    const command = new ListBucketsCommand({});
    await s3Client.send(command);
    return { available: true };
  } catch (error) {
    console.error("S3 service check failed:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return { 
      available: false, 
      error: errorMessage 
    };
  }
}

export async function checkSESStatus(): Promise<{ available: boolean; error?: string }> {
  try {
    const serverSideEndpoint =
      process.env.LOCALSTACK_ENDPOINT || "http://localhost:4566";
    const endpoint = `${serverSideEndpoint}/_aws/ses`;
    
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return { 
        available: false, 
        error: `HTTP ${response.status}: ${response.statusText}` 
      };
    }

    // レスポンスの内容を確認
    const text = await response.text();
    if (!text || text.trim() === "") {
      return { 
        available: false, 
        error: "Empty response from SES endpoint" 
      };
    }

    try {
      JSON.parse(text);
      return { available: true };
    } catch {
      return { 
        available: false, 
        error: "Invalid JSON response from SES endpoint" 
      };
    }
  } catch (error) {
    console.error("SES service check failed:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return { 
      available: false, 
      error: errorMessage 
    };
  }
}

export async function checkAllServices(): Promise<ServiceStatus> {
  const [s3Status, sesStatus] = await Promise.all([
    checkS3Status(),
    checkSESStatus(),
  ]);

  return {
    s3: s3Status,
    ses: sesStatus,
  };
}