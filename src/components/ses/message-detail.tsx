"use client";

import { SESMessageDetail } from "@/app/actions/ses-actions";
import { Clock, User, Users, Mail, FileText, Code, Copy } from "lucide-react";
import { useState } from "react";

interface MessageDetailProps {
  messageDetail: SESMessageDetail;
}

export function MessageDetail({ messageDetail }: MessageDetailProps) {
  const [activeTab, setActiveTab] = useState<
    "preview" | "html" | "text" | "raw"
  >("preview");
  const [copied, setCopied] = useState(false);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">{messageDetail.subject}</h2>
            <p className="text-muted-foreground">
              メッセージID: {messageDetail.messageId}
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">送信者:</span>
              <span>{messageDetail.source}</span>
            </div>

            <div className="flex items-start space-x-2">
              {messageDetail.destination.length === 1 ? (
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              ) : (
                <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
              )}
              <span className="font-medium">宛先:</span>
              <div className="flex-1">
                {messageDetail.destination.map((email, index) => (
                  <div key={index} className="text-sm">
                    {email}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">送信時刻:</span>
              <span>
                {messageDetail.timestamp.toLocaleDateString("ja-JP")}{" "}
                {messageDetail.timestamp.toLocaleTimeString("ja-JP")}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">ステータス:</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                {messageDetail.status === "sent"
                  ? "送信済み"
                  : messageDetail.status}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">形式:</span>
              <span>
                {messageDetail.bodyHtml ? "HTML + テキスト" : "テキストのみ"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="border-b">
          <nav className="flex space-x-1 p-1">
            <button
              onClick={() => setActiveTab("preview")}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "preview"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              プレビュー
            </button>
            {messageDetail.bodyHtml && (
              <button
                onClick={() => setActiveTab("html")}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "html"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                HTMLソース
              </button>
            )}
            <button
              onClick={() => setActiveTab("text")}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "text"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              テキスト
            </button>
            <button
              onClick={() => setActiveTab("raw")}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "raw"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              生メッセージ
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "preview" && (
            <div className="prose max-w-none">
              {messageDetail.bodyHtml ? (
                <div
                  dangerouslySetInnerHTML={{ __html: messageDetail.bodyHtml }}
                  className="border rounded p-4 bg-background"
                />
              ) : (
                <pre className="whitespace-pre-wrap font-sans text-sm">
                  {messageDetail.body}
                </pre>
              )}
            </div>
          )}

          {activeTab === "html" && messageDetail.bodyHtml && (
            <div className="relative">
              <button
                onClick={() => handleCopy(messageDetail.bodyHtml!)}
                className="absolute top-2 right-2 p-2 bg-background border rounded hover:bg-accent transition-colors"
                title="HTMLをコピー"
              >
                {copied ? (
                  <span className="text-xs">コピー済み</span>
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
              <pre className="bg-muted p-4 rounded overflow-x-auto text-sm">
                <code>{messageDetail.bodyHtml}</code>
              </pre>
            </div>
          )}

          {activeTab === "text" && (
            <div className="relative">
              <button
                onClick={() => handleCopy(messageDetail.body)}
                className="absolute top-2 right-2 p-2 bg-background border rounded hover:bg-accent transition-colors"
                title="テキストをコピー"
              >
                {copied ? (
                  <span className="text-xs">コピー済み</span>
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
              <pre className="bg-muted p-4 rounded overflow-x-auto text-sm whitespace-pre-wrap">
                {messageDetail.body}
              </pre>
            </div>
          )}

          {activeTab === "raw" && (
            <div className="relative">
              <button
                onClick={() => handleCopy(messageDetail.rawMessage)}
                className="absolute top-2 right-2 p-2 bg-background border rounded hover:bg-accent transition-colors"
                title="生メッセージをコピー"
              >
                {copied ? (
                  <span className="text-xs">コピー済み</span>
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
              <pre className="bg-muted p-4 rounded overflow-x-auto text-sm">
                <code>{messageDetail.rawMessage}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
