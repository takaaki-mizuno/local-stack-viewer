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
    // LocalStackの内部APIを使用してSESメッセージを取得
    const localstackEndpoint = process.env.LOCALSTACK_ENDPOINT || "http://localhost:4566";
    const sesApiUrl = `${localstackEndpoint}/_aws/ses`;
    
    console.log('Fetching SES messages from:', sesApiUrl);
    
    const response = await fetch(sesApiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('SES API response not ok:', response.status, response.statusText);
      throw new Error(`SES API call failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('SES API response:', data);

    if (!data.messages || !Array.isArray(data.messages)) {
      console.log('No messages found in LocalStack SES');
      return [];
    }

    return data.messages.map((msg: LocalStackSESMessage) => ({
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
    console.error('LocalStack endpoint:', process.env.LOCALSTACK_ENDPOINT);
    
    // エラーの場合はモックデータを返す
    console.log('Returning mock data due to error');
    return [
      {
        messageId: "mock-message-1",
        timestamp: new Date("2025-01-01T10:00:00Z"),
        source: "sender@example.com",
        destination: ["recipient@example.com"],
        subject: "テストメール 1",
        body: "これはテストメールの本文です。",
        bodyHtml: "<p>これは<strong>テストメール</strong>の本文です。</p>",
        status: "sent",
      },
      {
        messageId: "mock-message-2",
        timestamp: new Date("2025-01-01T11:00:00Z"),
        source: "admin@example.com",
        destination: ["user1@example.com", "user2@example.com"],
        subject: "お知らせ",
        body: "重要なお知らせがあります。",
        status: "sent",
      },
      {
        messageId: "mock-message-3",
        timestamp: new Date("2025-01-01T12:00:00Z"),
        source: "no-reply@example.com",
        destination: ["customer@example.com"],
        subject: "登録完了のお知らせ",
        body: "ご登録ありがとうございます。",
        bodyHtml:
          "<div><h2>ご登録ありがとうございます</h2><p>アカウントが正常に作成されました。</p></div>",
        status: "sent",
      },
    ];
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
