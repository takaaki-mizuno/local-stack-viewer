"use server";

import { GetAccountSendingEnabledCommand } from "@aws-sdk/client-ses";
import { sesClient } from "@/lib/aws-config";

export interface SESMessage {
  messageId: string;
  timestamp: Date;
  source: string;
  destination: string[];
  subject: string;
  body: string;
  bodyHtml?: string;
  status: "sent" | "bounced" | "complaint" | "delivery";
}

export interface SESMessageDetail extends SESMessage {
  headers: Record<string, string>;
  rawMessage: string;
}

interface LocalStackSESMessage {
  Id: string;
  Timestamp: string;
  Source: string;
  Destination?: {
    ToAddresses?: string[];
  };
  Subject: string;
  Body?: {
    text_part?: string;
    html_part?: string;
  };
}

export async function checkSESConnection(): Promise<boolean> {
  try {
    const command = new GetAccountSendingEnabledCommand({});
    await sesClient.send(command);
    return true;
  } catch (error) {
    console.error("SES connection failed:", error);
    return false;
  }
}

export async function getMessages(): Promise<SESMessage[]> {
  try {
    const serverSideEndpoint = process.env.LOCALSTACK_ENDPOINT || "http://localhost:4566";
    console.log('serverSideEndpoint:', serverSideEndpoint);
    
    // 複数のエンドポイントを試す
    const possibleEndpoints = [
      `${serverSideEndpoint}/_aws/ses`,
      `${serverSideEndpoint}/_localstack/ses`,
      `${serverSideEndpoint}/ses/_aws/messages`,
      `${serverSideEndpoint}/_aws/ses/messages`,
    ];

    let data: { messages?: LocalStackSESMessage[]; emails?: LocalStackSESMessage[] } | LocalStackSESMessage[] | null = null;
    let successfulEndpoint = '';

    for (const endpoint of possibleEndpoints) {
      try {
        console.log('Trying SES endpoint:', endpoint);
        
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log(`Response from ${endpoint}:`, response.status, response.statusText);

        if (response.ok) {
          data = await response.json() as { messages?: LocalStackSESMessage[]; emails?: LocalStackSESMessage[] } | LocalStackSESMessage[];
          successfulEndpoint = endpoint;
          console.log('Successfully fetched data from:', endpoint);
          break;
        }
      } catch (endpointError) {
        console.log(`Error with endpoint ${endpoint}:`, endpointError instanceof Error ? endpointError.message : 'Unknown error');
        continue;
      }
    }

    if (!data) {
      console.error('All SES endpoints failed. Trying LocalStack health check...');
      
      // LocalStackのヘルスチェックを試す
      try {
        const healthResponse = await fetch(`${serverSideEndpoint}/_localstack/health`, {
          method: 'GET',
        });
        const healthData = await healthResponse.json();
        console.log('LocalStack health:', healthData);
      } catch (healthError) {
        console.error('Health check failed:', healthError);
      }
      
      throw new Error("SESメッセージAPIにアクセスできません");
    }

    console.log('SES API response from', successfulEndpoint, ':', data);

    // レスポンス形式の確認と処理
    if (!data) {
      console.log('No data received from SES API');
      return [];
    }

    // 複数の可能なレスポンス形式を処理
    let messages: LocalStackSESMessage[] = [];
    
    if (Array.isArray(data)) {
      messages = data;
    } else if (data && typeof data === 'object') {
      if ('messages' in data && Array.isArray(data.messages)) {
        messages = data.messages;
      } else if ('emails' in data && Array.isArray(data.emails)) {
        messages = data.emails;
      } else {
        console.log('No messages found in response format:', Object.keys(data));
        return [];
      }
    } else {
      console.log('Unexpected response format');
      return [];
    }

    return messages.map((msg: LocalStackSESMessage) => ({
      messageId: msg.Id,
      timestamp: new Date(msg.Timestamp),
      source: msg.Source,
      destination: msg.Destination?.ToAddresses || [],
      subject: msg.Subject,
      body: msg.Body?.text_part || '',
      bodyHtml: msg.Body?.html_part || undefined,
      status: "sent" as const,
    }));
  } catch (error) {
    console.error("Failed to get messages:", error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      endpoint: process.env.LOCALSTACK_ENDPOINT,
    });
    throw new Error("メッセージ一覧の取得に失敗しました");
  }
}

export async function getMessageDetail(
  messageId: string
): Promise<SESMessageDetail> {
  try {
    const messages = await getMessages();
    const message = messages.find((m) => m.messageId === messageId);

    if (!message) {
      throw new Error("メッセージが見つかりません");
    }

    return {
      ...message,
      headers: {
        "Message-ID": messageId,
        From: message.source,
        To: message.destination.join(", "),
        Subject: message.subject,
        Date: message.timestamp.toISOString(),
        "Content-Type": message.bodyHtml
          ? "text/html; charset=utf-8"
          : "text/plain; charset=utf-8",
      },
      rawMessage: `From: ${message.source}
To: ${message.destination.join(", ")}
Subject: ${message.subject}
Date: ${message.timestamp.toISOString()}
Content-Type: ${
        message.bodyHtml
          ? "text/html; charset=utf-8"
          : "text/plain; charset=utf-8"
      }

${message.bodyHtml || message.body}`,
    };
  } catch (error) {
    console.error("Failed to get message detail:", error);
    throw new Error("メッセージ詳細の取得に失敗しました");
  }
}
