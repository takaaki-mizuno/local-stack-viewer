"use client";

import Link from "next/link";
import { Folder, Calendar } from "lucide-react";
import { S3Bucket } from "@/app/actions/s3-actions";

interface BucketListProps {
  buckets: S3Bucket[];
}

export function BucketList({ buckets }: BucketListProps) {
  if (buckets.length === 0) {
    return (
      <div className="text-center py-12">
        <Folder className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-sm font-semibold text-foreground">
          バケットがありません
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          LocalStackでS3バケットを作成してください
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {buckets.map((bucket) => (
        <Link
          key={bucket.name}
          href={`/s3/${bucket.name}`}
          className="rounded-lg border bg-card p-6 transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <div className="flex items-start space-x-3">
            <Folder className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold truncate">{bucket.name}</h3>
              {bucket.creationDate && (
                <div className="flex items-center mt-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  {bucket.creationDate.toLocaleDateString("ja-JP")}
                </div>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
