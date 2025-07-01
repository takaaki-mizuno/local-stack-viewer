"use client";

import { S3ObjectDetail } from "@/app/actions/s3-actions";
import { formatFileSize, isImageFile } from "@/lib/s3-utils";
import { Download, Calendar, HardDrive, FileText, Tag } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ObjectDetailProps {
  bucketName: string;
  objectDetail: S3ObjectDetail;
}

export function ObjectDetail({ bucketName, objectDetail }: ObjectDetailProps) {
  const [imageError, setImageError] = useState(false);
  const isImage = isImageFile(objectDetail.contentType) && !imageError;

  const handleDownload = () => {
    window.open(objectDetail.downloadUrl, "_blank");
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">{objectDetail.key}</h2>
            <p className="text-muted-foreground">バケット: {bucketName}</p>
          </div>
          <button
            onClick={handleDownload}
            className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>ダウンロード</span>
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <HardDrive className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">サイズ:</span>
              <span>{formatFileSize(objectDetail.size)}</span>
            </div>

            {objectDetail.lastModified && (
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">最終更新:</span>
                <span>
                  {objectDetail.lastModified.toLocaleDateString("ja-JP")}{" "}
                  {objectDetail.lastModified.toLocaleTimeString("ja-JP")}
                </span>
              </div>
            )}

            {objectDetail.contentType && (
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Content-Type:</span>
                <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-sm">
                  {objectDetail.contentType}
                </span>
              </div>
            )}
          </div>

          {Object.keys(objectDetail.metadata).length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Tag className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">メタデータ:</span>
              </div>
              <div className="space-y-2">
                {Object.entries(objectDetail.metadata).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center space-x-2 text-sm"
                  >
                    <span className="font-medium text-muted-foreground">
                      {key}:
                    </span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {isImage && (
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">プレビュー</h3>
          <div className="relative max-w-full">
            <Image
              src={objectDetail.downloadUrl}
              alt={objectDetail.key}
              width={800}
              height={600}
              className="max-w-full h-auto rounded-lg shadow-lg"
              onError={() => setImageError(true)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
