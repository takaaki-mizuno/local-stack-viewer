import { MainLayout } from "@/components/main-layout";
import { MessageDetail } from "@/components/ses/message-detail";
import { getMessageDetail } from "@/app/actions/ses-actions";
import { Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface MessageDetailPageProps {
  params: Promise<{ messageId: string }>;
}

export default async function MessageDetailPage({
  params,
}: MessageDetailPageProps) {
  const { messageId } = await params;

  try {
    const messageDetail = await getMessageDetail(messageId);

    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <Link
              href="/ses"
              className="p-2 hover:bg-accent rounded-md transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <Mail className="h-8 w-8 text-purple-600" />
            <div>
              <h1 className="text-2xl font-bold">メッセージ詳細</h1>
              <p className="text-muted-foreground">{messageDetail.subject}</p>
            </div>
          </div>

          <MessageDetail messageDetail={messageDetail} />
        </div>
      </MainLayout>
    );
  } catch {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <Link
              href="/ses"
              className="p-2 hover:bg-accent rounded-md transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <Mail className="h-8 w-8 text-purple-600" />
            <div>
              <h1 className="text-2xl font-bold">メッセージ詳細</h1>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-8 text-center">
            <div className="text-destructive">
              <p className="text-lg font-semibold">エラーが発生しました</p>
              <p className="text-sm text-muted-foreground mt-2">
                メッセージ &quot;{messageId}&quot; の詳細を取得できませんでした
              </p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }
}
