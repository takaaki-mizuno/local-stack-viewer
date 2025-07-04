import { MainLayout } from "@/components/main-layout";
import { Database, Mail, Activity, Server } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("home");

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-xl text-muted-foreground">{t("description")}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex items-center space-x-2">
              <Server className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold">LocalStack</h3>
                <p className="text-sm text-muted-foreground">
                  {t("localstackDescription")}
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
                  {t("s3Description")}
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
                  {t("sesDescription")}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-orange-600" />
              <div>
                <h3 className="text-lg font-semibold">{t("realtimeTitle")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("realtimeDescription")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-2xl font-semibold mb-4">{t("featuresTitle")}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">{t("s3FeaturesTitle")}</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• {t("s3Feature1")}</li>
                <li>• {t("s3Feature2")}</li>
                <li>• {t("s3Feature3")}</li>
                <li>• {t("s3Feature4")}</li>
                <li>• {t("s3Feature5")}</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">{t("sesFeaturesTitle")}</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• {t("sesFeature1")}</li>
                <li>• {t("sesFeature2")}</li>
                <li>• {t("sesFeature3")}</li>
                <li>• {t("sesFeature4")}</li>
                <li>• {t("sesFeature5")}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
