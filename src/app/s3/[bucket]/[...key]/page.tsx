import { MainLayout } from "@/components/main-layout";
import { ObjectDetail } from "@/components/s3/object-detail";
import { getObjectDetail } from "@/app/actions/s3-actions";
import { File, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ObjectDetailPageProps {
  params: Promise<{ bucket: string; key: string[] }>;
}

export default async function ObjectDetailPage({
  params,
}: ObjectDetailPageProps) {
  const { bucket, key } = await params;
  const bucketName = decodeURIComponent(bucket);
  const objectKey = key.map((segment) => decodeURIComponent(segment)).join("/");

  try {
    const objectDetail = await getObjectDetail(bucketName, objectKey);

    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <Link
              href={`/s3/${bucket}`}
              className="p-2 hover:bg-accent rounded-md transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <File className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold">オブジェクト詳細</h1>
              <p className="text-muted-foreground">
                {bucketName} / {objectKey}
              </p>
            </div>
          </div>

          <ObjectDetail bucketName={bucketName} objectDetail={objectDetail} />
        </div>
      </MainLayout>
    );
  } catch {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <Link
              href={`/s3/${bucket}`}
              className="p-2 hover:bg-accent rounded-md transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <File className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold">オブジェクト詳細</h1>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-8 text-center">
            <div className="text-destructive">
              <p className="text-lg font-semibold">エラーが発生しました</p>
              <p className="text-sm text-muted-foreground mt-2">
                オブジェクト &quot;{objectKey}&quot; の詳細を取得できませんでした
              </p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }
}
