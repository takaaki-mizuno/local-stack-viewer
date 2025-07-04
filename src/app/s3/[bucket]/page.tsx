import { MainLayout } from "@/components/main-layout";
import { ObjectList } from "@/components/s3/object-list";
import { RefreshButton } from "@/components/refresh-button";
import { listObjects } from "@/app/actions/s3-actions";
import { Folder, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface BucketPageProps {
  params: Promise<{ bucket: string }>;
}

export default async function BucketPage({ params }: BucketPageProps) {
  const { bucket } = await params;
  const bucketName = decodeURIComponent(bucket);

  try {
    const objects = await listObjects(bucketName);

    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link
                href="/s3"
                className="p-2 hover:bg-accent rounded-md transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <Folder className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold">{bucketName}</h1>
                <p className="text-muted-foreground">
                  {objects.length} 個のオブジェクト
                </p>
              </div>
            </div>

            <RefreshButton />
          </div>

          <ObjectList bucketName={bucketName} objects={objects} />
        </div>
      </MainLayout>
    );
  } catch {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <Link
              href="/s3"
              className="p-2 hover:bg-accent rounded-md transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <Folder className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold">{bucketName}</h1>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-8 text-center">
            <div className="text-destructive">
              <p className="text-lg font-semibold">エラーが発生しました</p>
              <p className="text-sm text-muted-foreground mt-2">
                バケット &quot;{bucketName}&quot;
                のオブジェクト一覧を取得できませんでした
              </p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }
}
