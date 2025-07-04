'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Globe } from 'lucide-react';
import { Locale } from '@/i18n/config';
import { setLocale } from '@/app/actions';

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const t = useTranslations('language');

  const handleLocaleChange = async (newLocale: Locale) => {
    // Use both client-side and server-side cookie setting for reliability
    document.cookie = `locale=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    
    try {
      await setLocale(newLocale);
    } catch (error) {
      console.error('Failed to set locale via server action:', error);
      window.location.reload();
    }
  };

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100">
        <Globe className="w-4 h-4" />
        <span>{t(locale)}</span>
      </button>
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
        <div className="py-1">
          <button
            onClick={() => handleLocaleChange('en')}
            className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 ${
              locale === 'en' ? 'bg-gray-50 font-medium' : ''
            }`}
          >
            {t('en')}
          </button>
          <button
            onClick={() => handleLocaleChange('ja')}
            className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 ${
              locale === 'ja' ? 'bg-gray-50 font-medium' : ''
            }`}
          >
            {t('ja')}
          </button>
        </div>
      </div>
    </div>
  );
}