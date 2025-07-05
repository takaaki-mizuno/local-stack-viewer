import { AlertTriangle, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";

interface ServiceUnavailableProps {
  service: "s3" | "ses";
  onRetry?: () => void;
}

export function ServiceUnavailable({ service, onRetry }: ServiceUnavailableProps) {
  const t = useTranslations('serviceStatus');
  
  const serviceKey = service === "s3" ? "s3Unavailable" : "sesUnavailable";
  const descriptionKey = service === "s3" ? "s3UnavailableDescription" : "sesUnavailableDescription";
  
  return (
    <div className="rounded-lg border bg-card p-8 text-center">
      <div className="flex justify-center mb-4">
        <AlertTriangle className="h-12 w-12 text-amber-500" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {t(serviceKey)}
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        {t(descriptionKey)}
      </p>
      <ul className="text-sm text-muted-foreground mb-6 text-left max-w-md mx-auto">
        <li className="mb-2">• {t('checkLocalStack')} (localhost:4566)</li>
        {service === "ses" && (
          <li className="mb-2">• {t('activateService')}</li>
        )}
      </ul>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          {t('../common.retry')}
        </button>
      )}
    </div>
  );
}