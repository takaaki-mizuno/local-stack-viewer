import { MainLayout } from "@/components/main-layout";
import { MessageList } from "@/components/ses/message-list";
import { RefreshButton } from "@/components/refresh-button";
import { getMessages } from "@/app/actions/ses-actions";
import { Mail } from "lucide-react";

export default async function SESPage() {
  try {
    const messages = await getMessages();

    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="h-8 w-8 text-purple-600" />
              <div>
                <h1 className="text-3xl font-bold">SES メッセージ</h1>
                <p className="text-muted-foreground">
                  {messages.length} 件のメッセージ
                </p>
              </div>
            </div>

            <RefreshButton />
          </div>

          <MessageList messages={messages} />
        </div>
      </MainLayout>
    );
  } catch (error) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <Mail className="h-8 w-8 text-purple-600" />
            <div>
              <h1 className="text-3xl font-bold">SES メッセージ</h1>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-8 text-center">
            <div className="text-destructive">
              <p className="text-lg font-semibold">
                SESサービスに接続できません
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                LocalStackが起動しているか確認してください
              </p>
              <RefreshButton />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }
}
