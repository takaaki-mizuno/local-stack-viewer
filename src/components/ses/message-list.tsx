"use client";

import Link from "next/link";
import {
  Mail,
  Clock,
  User,
  Users,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { SESMessage } from "@/app/actions/ses-actions";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface MessageListProps {
  messages: SESMessage[];
}

function getStatusIcon(status: SESMessage["status"]) {
  switch (status) {
    case "sent":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case "bounced":
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    case "complaint":
      return <AlertCircle className="h-4 w-4 text-orange-600" />;
    case "delivery":
      return <CheckCircle className="h-4 w-4 text-blue-600" />;
    default:
      return <Mail className="h-4 w-4 text-muted-foreground" />;
  }
}

function getStatusText(
  status: SESMessage["status"],
  t: (key: string) => string
) {
  switch (status) {
    case "sent":
      return t("statusSent");
    case "bounced":
      return t("statusBounced");
    case "complaint":
      return t("statusComplaint");
    case "delivery":
      return t("statusDelivered");
    default:
      return t("statusUnknown");
  }
}

function getStatusColor(status: SESMessage["status"]) {
  switch (status) {
    case "sent":
      return "text-green-600 bg-green-100";
    case "bounced":
      return "text-red-600 bg-red-100";
    case "complaint":
      return "text-orange-600 bg-orange-100";
    case "delivery":
      return "text-blue-600 bg-blue-100";
    default:
      return "text-muted-foreground bg-secondary";
  }
}

export function MessageList({ messages }: MessageListProps) {
  const t = useTranslations("ses");

  if (messages.length === 0) {
    return (
      <div className="text-center py-12">
        <Mail className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-sm font-semibold text-foreground">
          {t("empty")}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("emptyDescription")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <Link
          key={message.messageId}
          href={`/ses/${message.messageId}`}
          className="block rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 min-w-0 flex-1">
              <Mail className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium truncate">
                    {message.subject}
                  </h3>
                  <span
                    className={cn(
                      "px-2 py-1 rounded text-xs font-medium inline-flex items-center space-x-1",
                      getStatusColor(message.status)
                    )}
                  >
                    {getStatusIcon(message.status)}
                    <span>{getStatusText(message.status, t)}</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <span className="truncate">
                      {t("from")}: {message.source}
                    </span>
                  </div>

                  <div className="flex items-center">
                    {message.destination.length === 1 ? (
                      <User className="h-4 w-4 mr-1" />
                    ) : (
                      <Users className="h-4 w-4 mr-1" />
                    )}
                    <span className="truncate">
                      {t("to")}:{" "}
                      {message.destination.length === 1
                        ? message.destination[0]
                        : `${message.destination.length}${t("recipients")}`}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>
                      {message.timestamp.toLocaleDateString()}{" "}
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  {message.body}
                </p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
