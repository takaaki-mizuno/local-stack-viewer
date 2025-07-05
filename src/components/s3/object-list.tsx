"use client";

import Link from "next/link";
import {
  File,
  Image as ImageIcon,
  Trash2,
  Download,
  Calendar,
  HardDrive,
} from "lucide-react";
import { S3Object } from "@/app/actions/s3-actions";
import { formatFileSize, isImageFile } from "@/lib/s3-utils";
import { deleteObject } from "@/app/actions/s3-actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";

interface ObjectListProps {
  bucketName: string;
  objects: S3Object[];
}

export function ObjectList({ bucketName, objects }: ObjectListProps) {
  const router = useRouter();
  const [deletingKeys, setDeletingKeys] = useState<Set<string>>(new Set());
  const t = useTranslations("s3");

  const handleDelete = async (objectKey: string) => {
    if (!confirm(t("confirmDelete", { objectKey }))) {
      return;
    }

    setDeletingKeys((prev) => new Set(prev).add(objectKey));
    try {
      await deleteObject(bucketName, objectKey);
      router.refresh();
    } catch (error) {
      console.error("Delete failed:", error);
      alert(t("deleteFailed"));
    } finally {
      setDeletingKeys((prev) => {
        const newSet = new Set(prev);
        newSet.delete(objectKey);
        return newSet;
      });
    }
  };

  if (objects.length === 0) {
    return (
      <div className="text-center py-12">
        <File className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-sm font-semibold text-foreground">
          {t("objectsEmpty")}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("objectsEmptyDescription")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {objects.map((object) => {
        const isImage = isImageFile(object.storageClass);
        const isDeleting = deletingKeys.has(object.key);

        return (
          <div
            key={object.key}
            className="rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 min-w-0 flex-1">
                {isImage ? (
                  <ImageIcon className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                ) : (
                  <File className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                )}
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/s3/${bucketName}/${encodeURIComponent(object.key)}`}
                    className="text-lg font-medium hover:underline truncate block"
                  >
                    {object.key}
                  </Link>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <HardDrive className="h-4 w-4 mr-1" />
                      {formatFileSize(object.size)}
                    </div>
                    {object.lastModified && (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {object.lastModified.toLocaleDateString()}{" "}
                        {object.lastModified.toLocaleTimeString()}
                      </div>
                    )}
                    {object.storageClass && (
                      <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs">
                        {object.storageClass}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <Link
                  href={`/s3/${bucketName}/${encodeURIComponent(object.key)}`}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                  title={t("viewDetails")}
                >
                  <Download className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => handleDelete(object.key)}
                  disabled={isDeleting}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors disabled:opacity-50"
                  title={t("delete")}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
