import { MainLayout } from "@/components/main-layout";
import { BucketList } from "@/components/s3/bucket-list";
import { RefreshButton } from "@/components/refresh-button";
import { listBuckets } from "@/app/actions/s3-actions";
import { Database } from "lucide-react";
import { getTranslations } from 'next-intl/server';

export default async function S3Page() {
  const t = await getTranslations('s3');

  try {
    const buckets = await listBuckets();

    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Database className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-3xl font-bold">{t('title')}</h1>
                <p className="text-muted-foreground">
                  {buckets.length} {t('bucketsCount')}
                </p>
              </div>
            </div>

            <RefreshButton />
          </div>

          <BucketList buckets={buckets} />
        </div>
      </MainLayout>
    );
  } catch {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <Database className="h-8 w-8 text-green-600" />
            <div>
              <h1 className="text-3xl font-bold">{t('title')}</h1>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-8 text-center">
            <div className="text-destructive">
              <p className="text-lg font-semibold">
                {t('connectionError')}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {t('connectionErrorMessage')}
              </p>
              <RefreshButton />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }
}
