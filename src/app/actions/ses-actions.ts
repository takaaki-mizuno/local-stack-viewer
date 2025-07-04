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
    const serverSideEndpoint =
      process.env.LOCALSTACK_ENDPOINT || "http://localstack:4566";
    const endpoint = `${serverSideEndpoint}/_aws/ses`;
    console.log("SES endpoint:", endpoint);
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `SESメッセージAPIにアクセスできません: ${response.status} ${response.statusText}`
      );
    }

    const data = (await response.json()) as
      | { messages?: LocalStackSESMessage[]; emails?: LocalStackSESMessage[] }
      | LocalStackSESMessage[];

    // レスポンス形式の確認と処理
    let messages: LocalStackSESMessage[] = [];
    if (Array.isArray(data)) {
      messages = data;
    } else if (data && typeof data === "object") {
      if ("messages" in data && Array.isArray(data.messages)) {
        messages = data.messages;
      } else if ("emails" in data && Array.isArray(data.emails)) {
        messages = data.emails;
      } else {
        return [];
      }
    } else {
      return [];
    }

    return messages.map((msg: LocalStackSESMessage) => ({
      messageId: msg.Id,
      timestamp: new Date(msg.Timestamp),
      source: msg.Source,
      destination: msg.Destination?.ToAddresses || [],
      subject: msg.Subject,
      body: msg.Body?.text_part || "",
      bodyHtml: msg.Body?.html_part || undefined,
      status: "sent" as const,
    }));
  } catch (error) {
    console.error("Failed to get messages:", error);
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
