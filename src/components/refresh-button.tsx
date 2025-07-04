"use client";

import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export function RefreshButton() {
  const router = useRouter();
  const t = useTranslations("common");

  const handleRefresh = () => {
    router.refresh();
  };

  return (
    <button
      onClick={handleRefresh}
      className="flex items-center space-x-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
    >
      <RefreshCw className="h-4 w-4" />
      <span>{t("refresh")}</span>
    </button>
  );
}
