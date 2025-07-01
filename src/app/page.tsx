import { MainLayout } from "@/components/main-layout";
import { Database, Mail, Activity, Server } from "lucide-react";

export default function Home() {
  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            LocalStack Viewer
          </h1>
          <p className="text-xl text-muted-foreground">
            LocalStackのS3とSESサービスを管理するWebアプリケーション
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex items-center space-x-2">
              <Server className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold">LocalStack</h3>
                <p className="text-sm text-muted-foreground">
                  ローカル環境でのAWSサービスエミュレーション
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex items-center space-x-2">
              <Database className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="text-lg font-semibold">S3</h3>
                <p className="text-sm text-muted-foreground">
                  オブジェクトストレージの管理
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex items-center space-x-2">
              <Mail className="h-8 w-8 text-purple-600" />
              <div>
                <h3 className="text-lg font-semibold">SES</h3>
                <p className="text-sm text-muted-foreground">
                  メール送信サービスの監視
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-orange-600" />
              <div>
                <h3 className="text-lg font-semibold">リアルタイム</h3>
                <p className="text-sm text-muted-foreground">
                  リアルタイムでの状態監視
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-2xl font-semibold mb-4">機能</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">S3機能</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• バケット一覧表示</li>
                <li>• オブジェクト一覧・詳細表示</li>
                <li>• ファイルダウンロード</li>
                <li>• 画像プレビュー</li>
                <li>• オブジェクト削除</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">SES機能</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• 送信メール一覧表示</li>
                <li>• メール詳細情報表示</li>
                <li>• HTMLメール表示</li>
                <li>• 送受信者情報表示</li>
                <li>• 送信時間表示</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
